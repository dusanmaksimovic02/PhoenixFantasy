import TeamTable from "../components/GamePage/TeamTable";
import ActivePlayers from "../components/GamePage/ActivePlayers";
import GameInfo from "../components/GamePage/GameInfo";
import type { FC } from "react";
import { useLocation, useParams } from "react-router-dom";
import type { Game } from "../models/Game";
import { useQuery } from "@tanstack/react-query";
import { getTeamPlayers } from "../services/TeamService";

const GamePage: FC = () => {
  const { team1, team2 } = useParams();

  const location = useLocation();

  const game = location.state?.game as Game;
  const selectedHomeIds = location.state?.selectedHomeIds;
  const starterHomeIds = location.state?.starterHomeIds;
  const selectedGuestIds = location.state?.selectedGuestIds;
  const starterGuestIds = location.state?.starterGuestIds;

  const { data: homePlayers } = useQuery({
    queryKey: ["homePlayers"],
    queryFn: () => getTeamPlayers(game.homeTeam.id),
  });

  const { data: awayPlayers } = useQuery({
    queryKey: ["awayPlayers"],
    queryFn: () => getTeamPlayers(game.guestTeam.id),
  });

  const homeActivePlayers =
    homePlayers?.filter((player) => selectedHomeIds?.includes(player.id)) ?? [];

  const awayActivePlayers =
    awayPlayers?.filter((player) => selectedGuestIds?.includes(player.id)) ??
    [];

  return (
    <div className="w-screen h-fit min-h-screen pt-15">
      <GameInfo game={game} />
      <ActivePlayers
        homePlayers={homeActivePlayers}
        awayPlayers={awayActivePlayers}
      />
      <TeamTable team={team1!} />
      <TeamTable team={team2!} />
    </div>
  );
};

export default GamePage;
