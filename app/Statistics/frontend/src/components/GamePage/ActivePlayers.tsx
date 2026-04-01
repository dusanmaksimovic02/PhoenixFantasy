import type { FC } from "react";
import PlayerCard from "./PlayerCard";
import type { Player } from "../../models/Player";

interface ActivePlayersProps {
  homePlayers: Player[];
  awayPlayers: Player[];
}

const ActivePlayers: FC<ActivePlayersProps> = (props) => {
  return (
    <div className="p-10 flex gap-15">
      <div className="h-fit w-[50%]">
        {props.homePlayers.map((player) => (
          <PlayerCard
            id={player.id}
            name={player.firstName}
            surname={player.lastName}
            position={player.position}
            jerseyNumber={player.jerseyNumber}
            time={new Date()}
          />
        ))}
      </div>
      <div className="h-full w-[50%]">
        {props.awayPlayers.map((player) => (
          <PlayerCard
            id={player.id}
            name={player.firstName}
            surname={player.lastName}
            position={player.position}
            jerseyNumber={player.jerseyNumber}
            time={new Date()}
          />
        ))}
      </div>
    </div>
  );
};

export default ActivePlayers;
