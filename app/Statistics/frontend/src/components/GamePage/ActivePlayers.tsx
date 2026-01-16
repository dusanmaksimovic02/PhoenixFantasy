import type { FC } from "react";
import PlayerCard from "./PlayerCard";

const ActivePlayers: FC = () => {
  const activePlayers1 = Array.from({ length: 5 }, (_, index) => ({
    id: index + 1,
    name: `Player${index + 1}`,
    surname: `Suns`,
    position: [
      "Point Guard",
      "Shouting Guard",
      "Small Forward",
      "Power Forward",
      "Center",
    ][index % 5],
    jerseyNumber: index * 4,
    time: new Date(),
  }));
  const activePlayers2 = Array.from({ length: 5 }, (_, index) => ({
    id: index + 1,
    name: `Player${index + 1}`,
    surname: `State`,
    position: [
      "Point Guard",
      "Shouting Guard",
      "Small Forward",
      "Power Forward",
      "Center",
    ][index % 5],
    jerseyNumber: index * 4,
    time: new Date(),
  }));

  return (
    <div className="p-10 flex gap-15">
      <div className="h-fit w-[50%]">
        {activePlayers1.map((player) => (
          <PlayerCard
            id={player.id}
            name={player.name}
            surname={player.surname}
            position={player.position}
            jerseyNumber={player.jerseyNumber}
            time={player.time}
          />
        ))}
      </div>
      <div className="h-full w-[50%]">
        {activePlayers2.map((player) => (
          <PlayerCard
            id={player.id}
            name={player.name}
            surname={player.surname}
            position={player.position}
            jerseyNumber={player.jerseyNumber}
            time={player.time}
          />
        ))}
      </div>
    </div>
  );
};

export default ActivePlayers;
