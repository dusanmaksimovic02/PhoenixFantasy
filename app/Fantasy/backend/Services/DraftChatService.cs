using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using System.Text;
using System.Text.Json;

namespace FantasyApi.Services
{
    public class DraftChatMessage
    {
        public string Username { get; set; } = "";
        public string Message { get; set; } = "";
        public DateTime Timestamp { get; set; }
    }

    public class DraftChatService : IDisposable
    {
        private readonly IConfiguration _config;
        private IConnection? _connection;
        private IChannel? _channel;

        public DraftChatService(IConfiguration config)
        {
            _config = config;
        }

        // lazy konekcija jer kao pravi ga samo kad ti treba 
        private async Task EnsureConnectedAsync()
        {
            if (_connection != null && _connection.IsOpen) return;

            var factory = new ConnectionFactory
            {
                HostName = _config["RabbitMQ:Host"] ?? "localhost",
                Port = int.TryParse(_config["RabbitMQ:Port"], out var p) ? p : 5672,
                UserName = _config["RabbitMQ:Username"] ?? "guest",
                Password = _config["RabbitMQ:Password"] ?? "guest",
            };

            _connection = await factory.CreateConnectionAsync();
            _channel = await _connection.CreateChannelAsync();
        }

        // poseban exchange ya lige i poruke idu samo toj ligi
        private string GetExchangeName(string leagueId) => $"draft.chat.{leagueId}";

        public async Task PublishMessageAsync(string leagueId, string username, string message)
        {
            await EnsureConnectedAsync();

            var exchangeName = GetExchangeName(leagueId);

            // fanout ya ligu, ako ne postoji naparvi ga
            await _channel!.ExchangeDeclareAsync(
                exchange: exchangeName,
                type: ExchangeType.Fanout,
                durable: false,      // not durable - samo ya sesiju, ne postoji kad se restartuje server
                autoDelete: true     // autobrisanje kad queue ne postoji
            );

            var chatMessage = new DraftChatMessage
            {
                Username = username,
                Message = message,
                Timestamp = DateTime.Now
            };

            var json = JsonSerializer.Serialize(chatMessage);
            var body = Encoding.UTF8.GetBytes(json);

            await _channel.BasicPublishAsync(
                exchange: exchangeName,
                routingKey: "",  
                body: body
            );

            Console.WriteLine($"[DraftChat] [{leagueId}] {username}: {message}");
        }

        public async Task<(IChannel channel, string queueName)> SubscribeAsync(string leagueId)
        {
            await EnsureConnectedAsync();

            // svako subskrajber doboije svoj queue i autodeletion
            var subChannel = await _connection!.CreateChannelAsync();

            var exchangeName = GetExchangeName(leagueId);

            await subChannel.ExchangeDeclareAsync(
                exchange: exchangeName,
                type: ExchangeType.Fanout,
                durable: false,
                autoDelete: true
            );

            // exclusive + autoDelete queue radi samo dok postoji sesija
            var queueResult = await subChannel.QueueDeclareAsync(
                queue: "",           // server pravi jedinstveno ime 
                durable: false,
                exclusive: true,     
                autoDelete: true     // opet brise kad se konyumer diskonektuje
            );

            await subChannel.QueueBindAsync(
                queue: queueResult.QueueName,
                exchange: exchangeName,
                routingKey: ""
            );

            return (subChannel, queueResult.QueueName);
        }

        public void Dispose()
        {
            _channel?.CloseAsync();
            _connection?.CloseAsync();
        }
    }
}