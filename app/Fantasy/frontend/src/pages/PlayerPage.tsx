import { useLocation } from "react-router-dom";
import StatsCard from "../components/StatsCard";
import type { FC } from "react";
import { getAveragePlayerStats } from "../services/StatsService";
import { useQuery } from "@tanstack/react-query";

const PlayerPage: FC = () => {
  const location = useLocation();
  const playerId = location.state?.playerId;
  const teamName = location.state?.teamName;

  const { data: player, isFetched } = useQuery({
    queryKey: ["player", playerId],
    queryFn: () => getAveragePlayerStats(playerId),
  });

  return (
    <>
      <div className="h-screen min-h-screen w-screen sm:pt-16 flex  sm:gap-5 max-sm:w-svw max-sm:min-w-svw max-sm:pt-14">
        <div className="bg-phoenix h-full max-sm:w-svw max-sm:h-svh flex flex-col gap-5 justify-center items-center p-8 whitespace-nowrap text-white dark:text-black">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/7/7a/LeBron_James_%2851959977144%29_%28cropped2%29.jpg"
            alt="photo"
            className="w-50 h-62.5 max-sm:w-75 max-sm:h-87.5 "
          />
          <p className="text-2xl font-bold text-nowrap text-black dark:text-white">{`${player?.fullName}`}</p>
          <div className="text-black dark:text-white">
            <p>
              <strong>Date of Birth:</strong>datum rodjenja
            </p>
            <p>
              <strong>Team:</strong> {teamName}
            </p>
            <p>
              <strong>Jersey number: </strong>
              {player?.jerseyNumber}
            </p>
            <p>
              <strong>Position: </strong>
              Pozicija
            </p>
          </div>
        </div>
        {isFetched && (
          <div className="max-sm:hidden h-full w-full p-5 max-sm:h-svh max-sm:w-svw flex gap-5  flex-wrap items-stretch max-sm:overflow-y-scroll overflow-x-hidden">
            <StatsCard
              points={player!.pir}
              label={"Performance Index Rating"}
            />

            {/* <StatsCard points={player.gamesPlayed} label={"Game Played"} /> */}
            <StatsCard points={player!.points} label={"Points Per Game"} />
            <StatsCard points={player!.assists} label={"Assists Per Game"} />
            <StatsCard points={player!.rebounds} label={"Rebounds Per Game"} />
            <StatsCard
              points={player!.offensiveRebounds}
              label={"Offensive Rebounds Per Game"}
            />
            <StatsCard
              points={player!.defensiveRebounds}
              label={"Defensive Rebounds Per Game"}
            />
            <StatsCard points={player!.steals} label={"Steals Per Game"} />
            <StatsCard points={player!.blocks} label={"Block Per Game"} />
            <StatsCard
              points={player!.receivedBlocks}
              label={"Received Blocks Per Game"}
            />
            <StatsCard
              points={player!.turnovers}
              label={"Turnovers Per Game"}
            />
            <StatsCard
              points={player!.personalFouls}
              label={"Personal Fouls Per Game"}
            />
            <StatsCard
              points={player!.receivedFouls}
              label={"Received Fouls Per Game"}
            />
            <StatsCard
              points={player!.technicalFouls}
              label={"Technical Fouls Per Game"}
            />
            <StatsCard
              points={
                (
                  ((player!.twoPoint.made + player!.threePoint.made) /
                    (player!.twoPoint.missed +
                      player!.threePoint.missed +
                      player!.twoPoint.made +
                      player!.threePoint.made)) *
                  100
                ).toFixed(1) as unknown as number
              }
              label={"Field Goal Made"}
              percentage
              made={player!.twoPoint.made + player!.threePoint.made}
              miss={player!.twoPoint.missed + player!.threePoint.missed}
            />
            <StatsCard
              points={
                player!.twoPoint.percentage.toFixed(1) as unknown as number
              }
              label={"Two Points Pergentage"}
              percentage
              made={player!.twoPoint.made}
              miss={player!.twoPoint.missed}
            />
            <StatsCard
              points={
                player!.threePoint.percentage.toFixed(1) as unknown as number
              }
              label={"Three Points Pergentage"}
              percentage
              made={player!.threePoint.made}
              miss={player!.threePoint.missed}
            />
            <StatsCard
              points={
                player!.freeThrow.percentage.toFixed(1) as unknown as number
              }
              label={"Free Throw Pergentage"}
              percentage
              made={player!.freeThrow.made}
              miss={player!.freeThrow.missed}
            />
          </div>
        )}
      </div>
      {isFetched && (
        <div className="sm:hidden h-fit w-svw p-5 flex gap-5  flex-wrap items-stretch ">
          <StatsCard points={player!.pir} label={"Performance Index Rating"} />

          {/* <StatsCard points={player.gamesPlayed} label={"Game Played"} /> */}
          <StatsCard points={player!.points} label={"Points Per Game"} />
          <StatsCard points={player!.assists} label={"Assists Per Game"} />
          <StatsCard points={player!.rebounds} label={"Rebounds Per Game"} />
          <StatsCard
            points={player!.offensiveRebounds}
            label={"Offensive Rebounds Per Game"}
          />
          <StatsCard
            points={player!.defensiveRebounds}
            label={"Defensive Rebounds Per Game"}
          />
          <StatsCard points={player!.steals} label={"Steals Per Game"} />
          <StatsCard points={player!.blocks} label={"Block Per Game"} />
          <StatsCard
            points={player!.receivedBlocks}
            label={"Received Blocks Per Game"}
          />
          <StatsCard points={player!.turnovers} label={"Turnovers Per Game"} />
          <StatsCard
            points={player!.personalFouls}
            label={"Personal Fouls Per Game"}
          />
          <StatsCard
            points={player!.receivedFouls}
            label={"Received Fouls Per Game"}
          />
          <StatsCard
            points={player!.technicalFouls}
            label={"Technical Fouls Per Game"}
          />
          <StatsCard
            points={player!.twoPoint.percentage + player!.threePoint.percentage}
            label={"Field Goal Made"}
            percentage
            made={player!.twoPoint.made + player!.threePoint.made}
            miss={player!.twoPoint.missed + player!.threePoint.missed}
          />
          <StatsCard
            points={player!.twoPoint.percentage}
            label={"Two Points Pergentage"}
            percentage
            made={player!.twoPoint.made}
            miss={player!.twoPoint.missed}
          />
          <StatsCard
            points={player!.threePoint.percentage}
            label={"Three Points Pergentage"}
            percentage
            made={player!.threePoint.made}
            miss={player!.threePoint.missed}
          />
          <StatsCard
            points={player!.freeThrow.percentage}
            label={"Free Throw Pergentage"}
            percentage
            made={player!.freeThrow.made}
            miss={player!.freeThrow.missed}
          />
        </div>
      )}
    </>
  );
};

export default PlayerPage;
