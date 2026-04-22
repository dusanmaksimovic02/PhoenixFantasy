using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using System.Text;
using System.Text.Json;
using FantasyApi.Events;
using FantasyApi.Handlers;

namespace FantasyApi.Services;

public class StatsConsumerService : BackgroundService
{
    private readonly IConfiguration _config;
    private readonly IServiceScopeFactory _scopeFactory;
    private IConnection? _connection;
    private IChannel? _channel;

    private const string ExchangeName = "stats.topic";
    private const string PlayerStatsQueueName = "fantasy.player.stats";
    private const string PlayerStatsRoutingKey = "player.stats.updated";
    private const string GameEndedQueueName = "fantasy.game.ended";
    private const string GameEndedRoutingKey = "game.ended";
    private const string GameScoreQueueName = "fantasy.game.score";
    private const string GameScoreRoutingKey = "game.score.updated";

    public StatsConsumerService(IConfiguration config, IServiceScopeFactory scopeFactory)
    {
        _config = config;
        _scopeFactory = scopeFactory;
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

            await SetupQueueAsync(PlayerStatsQueueName, PlayerStatsRoutingKey, stoppingToken);
            await SetupQueueAsync(GameEndedQueueName, GameEndedRoutingKey, stoppingToken);
            await SetupQueueAsync(GameScoreQueueName, GameScoreRoutingKey, stoppingToken);

            Console.WriteLine("[Fantasy RabbitMQ] Connected and listening!");

            
            var playerStatsConsumer = new AsyncEventingBasicConsumer(_channel);
            playerStatsConsumer.ReceivedAsync += async (model, ea) =>
            {
                await RouteMessageAsync<PlayerStatsUpdatedEvent>(
                    ea,
                    async (evt, scope) =>
                        await scope.GetRequiredService<PlayerStatsUpdatedHandler>().HandleAsync(evt)
                );
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
                await RouteMessageAsync<GameEndedEvent>(
                    ea,
                    async (evt, scope) =>
                        await scope.GetRequiredService<GameEndedHandler>().HandleAsync(evt)
                );
            };

            await _channel.BasicConsumeAsync(
                queue: GameEndedQueueName,
                autoAck: false,
                consumer: gameEndedConsumer,
                cancellationToken: stoppingToken
            );

            
            var gameScoreConsumer = new AsyncEventingBasicConsumer(_channel);
            gameScoreConsumer.ReceivedAsync += async (model, ea) =>
            {
                await RouteMessageAsync<GameScoreUpdatedEvent>(
                    ea,
                    async (evt, scope) =>
                        await scope.GetRequiredService<GameScoreUpdatedHandler>().HandleAsync(evt)
                );
            };

            await _channel.BasicConsumeAsync(
                queue: GameScoreQueueName,
                autoAck: false,
                consumer: gameScoreConsumer,
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

    private async Task RouteMessageAsync<TEvent>(
        BasicDeliverEventArgs ea,
        Func<TEvent, IServiceProvider, Task> handle)
    {
        try
        {
            var body = ea.Body.ToArray();
            var message = Encoding.UTF8.GetString(body);
            var evt = JsonSerializer.Deserialize<TEvent>(message);

            if (evt != null)
            {
                using var scope = _scopeFactory.CreateScope();
                await handle(evt, scope.ServiceProvider);
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"[Fantasy RabbitMQ ERROR] Failed to process {typeof(TEvent).Name}: {ex.Message}");
        }
        finally
        {
            await _channel!.BasicAckAsync(ea.DeliveryTag, false);
        }
    }

    private async Task SetupQueueAsync(string queueName, string routingKey, CancellationToken ct)
    {
        await _channel!.QueueDeclareAsync(
            queue: queueName,
            durable: true,
            exclusive: false,
            autoDelete: false,
            cancellationToken: ct
        );

        await _channel.QueueBindAsync(
            queue: queueName,
            exchange: ExchangeName,
            routingKey: routingKey,
            cancellationToken: ct
        );
    }

    public override async Task StopAsync(CancellationToken cancellationToken)
    {
        await base.StopAsync(cancellationToken);
        if (_channel != null) await _channel.CloseAsync();
        if (_connection != null) await _connection.CloseAsync();
    }
}