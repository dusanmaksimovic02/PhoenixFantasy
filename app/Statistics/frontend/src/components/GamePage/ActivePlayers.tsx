import type { FC } from "react";
import PlayerCard from "./PlayerCard";
import type { Player } from "../../models/Player";
import { useQuery } from "@tanstack/react-query";
import { getTeamStartersFromGame } from "../../services/LiveGameService";

interface ActivePlayersProps {
  homePlayers: Player[];
  awayPlayers: Player[];
  homeTeamId: string;
  guestTeamId: string;
  gameId: string;
}

const ActivePlayers: FC<ActivePlayersProps> = (props) => {
  const { data: homeStarters = [] } = useQuery({
    queryKey: ["homeTeamStarters", props.homeTeamId, props.gameId],
    queryFn: () => getTeamStartersFromGame(props.homeTeamId, props.gameId),
  });

  const { data: guestStarters = [] } = useQuery({
    queryKey: ["guestTeamStarters", props.guestTeamId, props.gameId],
    queryFn: () => getTeamStartersFromGame(props.guestTeamId, props.gameId),
  });

  return (
    <div className="p-10 flex gap-15">
      <div className="h-fit w-[50%]">
        {homeStarters.map((player) => (
          <PlayerCard
            id={player.id}
            name={player.firstName}
            surname={player.lastName}
            position={player.position}
            jerseyNumber={player.jerseyNumber}
            time={new Date()}
            gameId={props.gameId}
            selectedPlayer={player}
            teamId={props.homeTeamId}
          />
        ))}
      </div>
      <div className="h-full w-[50%]">
        {guestStarters.map((player) => (
          <PlayerCard
            id={player.id}
            name={player.firstName}
            surname={player.lastName}
            position={player.position}
            jerseyNumber={player.jerseyNumber}
            time={new Date()}
            gameId={props.gameId}
            selectedPlayer={player}
            teamId={props.guestTeamId}
          />
        ))}
      </div>
    </div>
  );
};

export default ActivePlayers;
