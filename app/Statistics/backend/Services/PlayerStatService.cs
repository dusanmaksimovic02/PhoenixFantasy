/*
public class PlayerStatService
{
    private readonly StatsDbContext _context;

    public PlayerStatService(StatsDbContext context)
    {
        _context = context;
    }

    public async Task UpdateStatAsync(UpdatePlayerStatDto dto)
    {
        var stats = await _context.PlayerGameStats
            .Include(x => x.Player)
            .Include(x => x.Game)
            .FirstOrDefaultAsync(x =>
                x.Player!.Id == dto.PlayerId &&
                x.Game!.Id == dto.GameId
            );

        if (stats == null)
            throw new Exception("Stats for player and game not found");

        var command = new UpdatePlayerStatCommand(
            stats,
            dto.StatType,
            dto.Delta
        );

        command.Execute();

        await _context.SaveChangesAsync();
    }
    /*public void Execute(IPlayerStatCommand command)
    {
        command.Execute();
    }
}

public class UpdatePlayerStatDto
{
    public int GameId { get; set; }
    public string PlayerId { get; set; } = null!;
    public List<StatChange> Changes { get; set; } = new();
}

public class StatChange
{
    public PlayerStatType StatType { get; set; }
    public int Delta { get; set; }
}
*/
