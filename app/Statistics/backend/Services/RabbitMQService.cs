    using RabbitMQ.Client;
    using RabbitMQ.Client.Events;
    using System.Text;

    namespace StatsApi.Services
    {
        public class RabbitMQService : BackgroundService, IRabbitMQService
        {
            private readonly IConfiguration _config;
            private IConnection? _connection;
            private IChannel? _channel;
            private const string QueueName = "chat_queue";

            public event Action<string>? MessageReceived;

            public RabbitMQService(IConfiguration config)
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

                    await _channel.QueueDeclareAsync(
                        queue: QueueName,
                        durable: false,
                        exclusive: false,
                        autoDelete: false,
                        cancellationToken: stoppingToken
                    );

                    var consumer = new AsyncEventingBasicConsumer(_channel);
                    consumer.ReceivedAsync += async (model, ea) =>
                    {
                        var body = ea.Body.ToArray();
                        var message = Encoding.UTF8.GetString(body);
                        MessageReceived?.Invoke(message);
                        await Task.CompletedTask;
                    };

                    await _channel.BasicConsumeAsync(
                        QueueName,
                        autoAck: true,
                        consumer: consumer,
                        cancellationToken: stoppingToken
                    );

                    Console.WriteLine("[RabbitMQ] Connected successfully!");

                    await Task.Delay(Timeout.Infinite, stoppingToken);
                }
                catch (OperationCanceledException)
                {
                    
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"[RabbitMQ ERROR] Connection failed: {ex.Message}");
                }
            }

            public async Task PublishMessageAsync(string message)
            {
                if (_channel == null)
                {
                    Console.WriteLine("[RabbitMQ ERROR] Channel is null, message not sent.");
                    return;
                }

                try
                {
                    var body = Encoding.UTF8.GetBytes(message);
                    await _channel.BasicPublishAsync(
                        exchange: "",
                        routingKey: QueueName,
                        body: body
                    );
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"[RabbitMQ ERROR] Failed to publish message: {ex.Message}");
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