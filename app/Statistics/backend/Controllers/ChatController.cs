using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StatsApi.Data;
using StatsApi.Services;
using System.Text.Json;

namespace StatsApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ChatController : ControllerBase
    {
        private readonly RabbitMQService _rabbitMQ;
        private readonly DataContext _context;

        public ChatController(RabbitMQService rabbitMQ, DataContext context)
        {
            _rabbitMQ = rabbitMQ;
            _context = context;
        }

        [HttpPost("send")]
        public async Task<IActionResult> SendMessage([FromBody] ChatMessageDto message)
        {
            var chatMessage = new StatsApi.Models.ChatMessage
            {
                Username = message.Username,
                Message = message.Message,
                Timestamp = DateTime.UtcNow
            };

            _context.ChatMessages.Add(chatMessage);
            await _context.SaveChangesAsync();

            var json = JsonSerializer.Serialize(new
            {
                chatMessage.Username,
                chatMessage.Message,
                chatMessage.Timestamp
            });

            await _rabbitMQ.PublishMessageAsync(json);
            return Ok();
        }

        [HttpGet("history")]
        public async Task<IActionResult> GetHistory()
        {
            var messages = await _context.ChatMessages
                .OrderByDescending(m => m.Timestamp)
                .Take(40)
                .OrderBy(m => m.Timestamp)
                .ToListAsync();

            return Ok(messages);
        }

        [HttpGet("stream")]
        public async Task Stream(CancellationToken cancellationToken)
        {
            Response.Headers.Append("Content-Type", "text/event-stream");
            Response.Headers.Append("Cache-Control", "no-cache");
            Response.Headers.Append("Connection", "keep-alive");

            var messageQueue = new System.Collections.Concurrent.ConcurrentQueue<string>();
            var semaphore = new SemaphoreSlim(0);

            Action<string> handler = (msg) =>
            {
                messageQueue.Enqueue(msg);
                semaphore.Release();
            };

            _rabbitMQ.MessageReceived += handler;

            try
            {
                while (!cancellationToken.IsCancellationRequested)
                {
                    await semaphore.WaitAsync(cancellationToken);

                    while (messageQueue.TryDequeue(out var message))
                    {
                        await Response.WriteAsync($"data: {message}\n\n", cancellationToken);
                        await Response.Body.FlushAsync(cancellationToken);
                    }
                }
            }
            catch (OperationCanceledException) { }
            finally
            {
                _rabbitMQ.MessageReceived -= handler;
            }
        }
    }

    public class ChatMessageDto
    {
        public string Username { get; set; } = "";
        public string Message { get; set; } = "";
    }
}