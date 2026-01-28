using StatsApi.Models;

public class UpdatePlayerStatCommand// : IPlayerStatCommand
{
    private readonly PlayerGameStats _stats;
    private readonly PlayerStatType _statType;
    private readonly int _delta; // +1 ili -1

    public UpdatePlayerStatCommand(
        PlayerGameStats stats,
        PlayerStatType statType,
        int delta)
    {
        _stats = stats;
        _statType = statType;
        _delta = delta;
    }

    public void Execute()
    {
        switch (_statType)
        {
            case PlayerStatType.Points:
                _stats.Points = (_stats.Points ?? 0) + _delta;
                break;

            case PlayerStatType.Made1p:
                _stats.Made1p = (_stats.Made1p ?? 0) + _delta;
                _stats.Pir = _stats.Made1p + _delta;
                _stats.Points = (_stats.Made1p ?? 0) + _delta;
                break;

            case PlayerStatType.Miss1p:
                _stats.Miss1p = (_stats.Miss1p ?? 0) + _delta;
                _stats.Pir = _stats.Made1p - _delta;
                break;

            case PlayerStatType.Made2p:
                _stats.Made2p = (_stats.Made2p ?? 0) + _delta;
                _stats.Points = (_stats.Made1p ?? 0) + _delta * 2;
                _stats.Pir = _stats.Made1p + _delta * 2;
                break;

            case PlayerStatType.Miss2p:
                _stats.Miss2p = (_stats.Miss2p ?? 0) + _delta;
                _stats.Pir = _stats.Made1p - _delta;
                break;

            case PlayerStatType.Made3p:
                _stats.Made3p = (_stats.Made3p ?? 0) + _delta;
                _stats.Points = (_stats.Made1p ?? 0) + _delta * 3;
                _stats.Pir = _stats.Made1p + _delta * 3;
                break;

            case PlayerStatType.Miss3p:
                _stats.Miss3p = (_stats.Miss3p ?? 0) + _delta;
                _stats.Pir = _stats.Made1p - _delta;
                break;

            case PlayerStatType.Assists:
                _stats.Assists = (_stats.Assists ?? 0) + _delta;
                _stats.Pir = _stats.Made1p + _delta;
                break;

            case PlayerStatType.Rebounds:
                _stats.Rebounds = (_stats.Rebounds ?? 0) + _delta;
                _stats.Pir = _stats.Made1p + _delta;
                break;

            case PlayerStatType.OffensiveRebounds:
                _stats.OffensiveRebounds = (_stats.OffensiveRebounds ?? 0) + _delta;
                _stats.Rebounds = (_stats.Rebounds ?? 0) + _delta;
                _stats.Pir = _stats.Made1p + _delta;
                break;

            case PlayerStatType.DefensiveRebounds:
                _stats.DefensiveRebounds = (_stats.DefensiveRebounds ?? 0) + _delta;
                _stats.Rebounds = (_stats.Rebounds ?? 0) + _delta;
                _stats.Pir = _stats.Made1p + _delta;
                break;

            case PlayerStatType.Steals:
                _stats.Steals = (_stats.Steals ?? 0) + _delta;
                _stats.Pir = _stats.Made1p + _delta;
                break;

            case PlayerStatType.Turnovers:
                _stats.Turnovers = (_stats.Turnovers ?? 0) + _delta;
                _stats.Pir = _stats.Made1p - _delta;
                break;


            case PlayerStatType.PersonalFouls:
                _stats.PersonalFouls = (_stats.PersonalFouls ?? 0) + _delta;
                _stats.Pir = _stats.Made1p - _delta;
                break;

            case PlayerStatType.RecievedFouls:
                _stats.RecievedFouls = (_stats.RecievedFouls ?? 0) + _delta;
                _stats.Pir = _stats.Made1p + _delta;
                break;

            case PlayerStatType.Blocks:
                _stats.Blocks = (_stats.Blocks ?? 0) + _delta;
                _stats.Pir = _stats.Made1p + _delta;
                break;

            case PlayerStatType.RecievedBlocks:
                _stats.RecievedBlocks = (_stats.RecievedBlocks ?? 0) + _delta;
                _stats.Pir = _stats.Made1p - _delta;
                break;

            case PlayerStatType.TechnicalFouls:
                _stats.TechnicalFouls = (_stats.TechnicalFouls ?? 0) + _delta;
                _stats.PersonalFouls = (_stats.PersonalFouls ?? 0) + _delta;
                _stats.Pir = _stats.Made1p - _delta;
                break;

            default:
                throw new ArgumentOutOfRangeException();
        }
    }
}
