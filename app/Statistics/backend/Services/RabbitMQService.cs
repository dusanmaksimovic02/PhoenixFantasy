using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using System.Text;

namespace StatsApi.Services
{
    public class RabbitMQService : IDisposable
    {
        private readonly IConnection _connection;
        private readonly IChannel _channel;
        private const string QueueName = "chat_queue";

        public event Action<string>? MessageReceived;

        public RabbitMQService(IConfiguration config)
        {
            var factory = new ConnectionFactory
            {
                HostName = config["RabbitMQ:Host"],
                Port = int.Parse(config["RabbitMQ:Port"]!),
                UserName = config["RabbitMQ:Username"],
                Password = config["RabbitMQ:Password"]
            };

            _connection = factory.CreateConnectionAsync().GetAwaiter().GetResult();
            _channel = _connection.CreateChannelAsync().GetAwaiter().GetResult();

            _channel.QueueDeclareAsync(
                queue: QueueName,
                durable: false,
                exclusive: false,
                autoDelete: false
            ).GetAwaiter().GetResult();

            var consumer = new AsyncEventingBasicConsumer(_channel);
            consumer.ReceivedAsync += async (model, ea) =>
            {
                var body = ea.Body.ToArray();
                var message = Encoding.UTF8.GetString(body);
                MessageReceived?.Invoke(message);
                await Task.CompletedTask;
            };

            _channel.BasicConsumeAsync(QueueName, autoAck: true, consumer: consumer)
                .GetAwaiter().GetResult();
        }

        public async Task PublishMessageAsync(string message)
        {
            var body = Encoding.UTF8.GetBytes(message);
            await _channel.BasicPublishAsync(
                exchange: "",
                routingKey: QueueName,
                body: body
            );
        }

        public void Dispose()
        {
            _channel?.CloseAsync();
            _connection?.CloseAsync();
        }
    }
}