import type { FC } from "react";
import TopPlayerCard from "./TopPlayerCard";
import { useQuery } from "@tanstack/react-query";
import { getTopPlayers } from "../../services/StatsService";

const TopPlayer: FC = () => {
  const { data: players } = useQuery({
    queryKey: ["topPlayers"],
    queryFn: getTopPlayers,
  });

  return (
    <>
      <h1 className="text-black dark:text-white font-extrabold text-4xl p-5 pt-0 px-24 max-sm:px-5 ">
        Top <span className="text-phoenix">Performers</span> For{" "}
        <span className="text-phoenix"> Your Team</span>
      </h1>
      <div className="p-5 pt-10 flex gap-10 flex-col max-sm:justify-center max-sm:items-center font-palanquin px-24 max-sm:px-5">
        <div className="flex gap-10 justify-around p-8 snap-x snap-mandatory overflow-x-auto max-sm:w-svw ">
          {players &&
            players.map(
              (player: {
                id: string;
                firstName: string;
                lastName: string;
                position: string;
                avgPir: number;
                avgPoints: number;
                avgAssists: number;
                avgRebounds: number;
              }) => <TopPlayerCard key={player.id} player={player} />,
            )}
        </div>
      </div>
    </>
  );
};

export default TopPlayer;
