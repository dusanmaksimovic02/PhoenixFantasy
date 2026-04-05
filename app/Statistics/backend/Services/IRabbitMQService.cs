namespace StatsApi.Services
{
    public interface IRabbitMQService
    {
        Task PublishMessageAsync(string message);
        Task PublishToExchangeAsync(string exchangeName, string routingKey, string message);
        event Action<string>? MessageReceived;
    }
}