namespace StatsApi.Services
{
    public interface IRabbitMQService
    {
        Task PublishMessageAsync(string message);
        event Action<string>? MessageReceived;
    }
}