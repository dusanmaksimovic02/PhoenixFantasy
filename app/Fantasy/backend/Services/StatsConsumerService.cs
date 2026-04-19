using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using System.Text;
using System.Text.Json;

namespace FantasyApi.Services
{
    
    public class GameEndedEvent
    {
        public Guid GameId { get; set; }
        public Guid HomeTeamId { get; set; }
        public Guid GuestTeamId { get; set; }
        public string HomeTeamName { get; set; } = "";
        public string GuestTeamName { get; set; } = "";
        public int HomeTeamScore { get; set; }
        public int GuestTeamScore { get; set; }
        public DateTime Timestamp { get; set; }
    }

    public class StatsConsumerService : BackgroundService
    {
        private readonly IConfiguration _config;
        private IConnection? _connection;
        private IChannel? _channel;
        private const string ExchangeName = "stats.topic";

        
        private const string PlayerStatsQueueName = "fantasy.player.stats";
        private const string PlayerStatsRoutingKey = "player.stats.updated";

        
        private const string GameEndedQueueName = "fantasy.game.ended";
        private const string GameEndedRoutingKey = "game.ended";

        public StatsConsumerService(IConfiguration config)
        {
            _config = config;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            try
            {
                var factory = new ConnectionFactory
                {
                    HostName = _config["RabbitMQ:Host"] ?? "localhost",
                    Port = int.TryParse(_config["RabbitMQ:Port"], out var p) ? p : 5672,
                    UserName = _config["RabbitMQ:Username"] ?? "guest",
                    Password = _config["RabbitMQ:Password"] ?? "guest",
                    AutomaticRecoveryEnabled = true,
                    NetworkRecoveryInterval = TimeSpan.FromSeconds(10)
                };

                _connection = await factory.CreateConnectionAsync(stoppingToken);
                _channel = await _connection.CreateChannelAsync(cancellationToken: stoppingToken);

               
                await _channel.ExchangeDeclareAsync(
                    exchange: ExchangeName,
                    type: ExchangeType.Topic,
                    durable: true,
                    autoDelete: false,
                    cancellationToken: stoppingToken
                );

                
                await _channel.QueueDeclareAsync(
                    queue: PlayerStatsQueueName,
                    durable: true,
                    exclusive: false,
                    autoDelete: false,
                    cancellationToken: stoppingToken
                );

                await _channel.QueueBindAsync(
                    queue: PlayerStatsQueueName,
                    exchange: ExchangeName,
                    routingKey: PlayerStatsRoutingKey,
                    cancellationToken: stoppingToken
                );

                
                await _channel.QueueDeclareAsync(
                    queue: GameEndedQueueName,
                    durable: true,
                    exclusive: false,
                    autoDelete: false,
                    cancellationToken: stoppingToken
                );

                await _channel.QueueBindAsync(
                    queue: GameEndedQueueName,
                    exchange: ExchangeName,
                    routingKey: GameEndedRoutingKey,
                    cancellationToken: stoppingToken
                );

                Console.WriteLine("[Fantasy RabbitMQ] Connected and listening on player stats and game ended queues!");

                var playerStatsConsumer = new AsyncEventingBasicConsumer(_channel);
                playerStatsConsumer.ReceivedAsync += async (model, ea) =>
                {
                    var body = ea.Body.ToArray();
                    var message = Encoding.UTF8.GetString(body);

                    Console.WriteLine($"[Fantasy RabbitMQ] Player stats update received:");
                    Console.WriteLine(message);

                    await _channel.BasicAckAsync(ea.DeliveryTag, false);
                };

                await _channel.BasicConsumeAsync(
                    queue: PlayerStatsQueueName,
                    autoAck: false,
                    consumer: playerStatsConsumer,
                    cancellationToken: stoppingToken
                );

               
                var gameEndedConsumer = new AsyncEventingBasicConsumer(_channel);
                gameEndedConsumer.ReceivedAsync += async (model, ea) =>
                {
                    var body = ea.Body.ToArray();
                    var message = Encoding.UTF8.GetString(body);

                    try
                    {
                        var gameEvent = JsonSerializer.Deserialize<GameEndedEvent>(message);
                        if (gameEvent != null)
                        {
                            Console.WriteLine($"[Fantasy RabbitMQ] Game ended received:");
                            Console.WriteLine($"  Game: {gameEvent.GameId}");
                            Console.WriteLine($"  {gameEvent.HomeTeamName} {gameEvent.HomeTeamScore} - {gameEvent.GuestTeamScore} {gameEvent.GuestTeamName}");

                           
                        }
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine($"[Fantasy RabbitMQ ERROR] Failed to process game ended event: {ex.Message}");
                    }

                    await _channel.BasicAckAsync(ea.DeliveryTag, false);
                };

                await _channel.BasicConsumeAsync(
                    queue: GameEndedQueueName,
                    autoAck: false,
                    consumer: gameEndedConsumer,
                    cancellationToken: stoppingToken
                );

                await Task.Delay(Timeout.Infinite, stoppingToken);
            }
            catch (OperationCanceledException) { }
            catch (Exception ex)
            {
                Console.WriteLine($"[Fantasy RabbitMQ ERROR] Connection failed: {ex.Message}");
            }
        }

        public override async Task StopAsync(CancellationToken cancellationToken)
        {
            await base.StopAsync(cancellationToken);
            if (_channel != null) await _channel.CloseAsync();
            if (_connection != null) await _connection.CloseAsync();
        }
    }
}