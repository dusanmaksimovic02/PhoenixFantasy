using System.Text;
using System.Text.Json;
using FantasyApi.Services;
using Microsoft.AspNetCore.Mvc;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;

namespace FantasyApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DraftChatController : ControllerBase
{
    private readonly DraftChatService _chatService;

    public DraftChatController(DraftChatService chatService)
    {
        _chatService = chatService;
    }

    [HttpPost("send")]
    public async Task<IActionResult> SendMessage([FromBody] SendDraftChatDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Message))
            return BadRequest(new { message = "Message cannot be empty." });

        await _chatService.PublishMessageAsync(dto.LeagueId, dto.Username, dto.Message);
        return Ok(new { message = "Message sent." });
    }

    [HttpGet("stream/{leagueId}")]
    public async Task StreamMessages(string leagueId, CancellationToken cancellationToken)
    {
        Response.Headers["Content-Type"] = "text/event-stream";
        Response.Headers["Cache-Control"] = "no-cache";
        Response.Headers["Connection"] = "keep-alive";

        var (channel, queueName) = await _chatService.SubscribeAsync(leagueId);

        var tcs = new TaskCompletionSource();

        var consumer = new AsyncEventingBasicConsumer(channel);

        consumer.ReceivedAsync += async (model, ea) =>
        {
            try
            {
                var body = ea.Body.ToArray();
                var json = Encoding.UTF8.GetString(body);

                await Response.WriteAsync($"data: {json}\n\n", cancellationToken);
                await Response.Body.FlushAsync(cancellationToken);

                await channel.BasicAckAsync(ea.DeliveryTag, false);
            }
            catch
            {
                tcs.TrySetResult();
            }
        };

        await channel.BasicConsumeAsync(queue: queueName, autoAck: false, consumer: consumer);

        Console.WriteLine($"[DraftChat] User connected to league {leagueId}");

        cancellationToken.Register(() => tcs.TrySetResult());
        await tcs.Task;

        Console.WriteLine($"[DraftChat] User disconnected from league {leagueId}");

        await channel.CloseAsync();
    }
}
