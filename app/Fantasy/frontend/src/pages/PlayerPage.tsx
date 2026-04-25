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
            src={`${player?.imageUrl}`}
            alt="photo"
            className="w-50 h-62.5 max-sm:w-75 max-sm:h-87.5 "
          />
          <p className="text-2xl font-bold text-nowrap text-black dark:text-white">{`${player?.playerStats.fullName}`}</p>
          <div className="text-black dark:text-white">
            <p>
              <strong>Date of Birth:</strong>
              {player?.player.dateOfBirth}
            </p>
            <p>
              <strong>Team:</strong> {teamName}
            </p>
            <p>
              <strong>Jersey number: </strong>
              {player?.player.jerseyNumber}
            </p>
            <p>
              <strong>Position: </strong>
              {player?.player.position}
            </p>
          </div>
        </div>
        {isFetched && (
          <div className="max-sm:hidden h-full w-full p-5 max-sm:h-svh max-sm:w-svw flex gap-5  flex-wrap items-stretch max-sm:overflow-y-scroll overflow-x-hidden">
            <StatsCard
              points={player!.playerStats.pir.toFixed(1) as unknown as number}
              label={"Performance Index Rating"}
            />

            {/* <StatsCard points={player.gamesPlayed} label={"Game Played"} /> */}
            <StatsCard
              points={
                player!.playerStats.points.toFixed(1) as unknown as number
              }
              label={"Points Per Game"}
            />
            <StatsCard
              points={player!.playerStats.assists}
              label={"Assists Per Game"}
            />
            <StatsCard
              points={player!.playerStats.rebounds}
              label={"Rebounds Per Game"}
            />
            <StatsCard
              points={player!.playerStats.offensiveRebounds}
              label={"Offensive Rebounds Per Game"}
            />
            <StatsCard
              points={player!.playerStats.defensiveRebounds}
              label={"Defensive Rebounds Per Game"}
            />
            <StatsCard
              points={player!.playerStats.steals}
              label={"Steals Per Game"}
            />
            <StatsCard
              points={player!.playerStats.blocks}
              label={"Block Per Game"}
            />
            <StatsCard
              points={player!.playerStats.receivedBlocks}
              label={"Received Blocks Per Game"}
            />
            <StatsCard
              points={player!.playerStats.turnovers}
              label={"Turnovers Per Game"}
            />
            <StatsCard
              points={player!.playerStats.personalFouls}
              label={"Personal Fouls Per Game"}
            />
            <StatsCard
              points={player!.playerStats.receivedFouls}
              label={"Received Fouls Per Game"}
            />
            <StatsCard
              points={player!.playerStats.technicalFouls}
              label={"Technical Fouls Per Game"}
            />
            <StatsCard
              points={
                (
                  ((player!.playerStats.twoPoint.made +
                    player!.playerStats.threePoint.made) /
                    (player!.playerStats.twoPoint.missed +
                      player!.playerStats.threePoint.missed +
                      player!.playerStats.twoPoint.made +
                      player!.playerStats.threePoint.made)) *
                  100
                ).toFixed(1) as unknown as number
              }
              label={"Field Goal Made"}
              percentage
              made={
                player!.playerStats.twoPoint.made +
                player!.playerStats.threePoint.made
              }
              miss={
                player!.playerStats.twoPoint.missed +
                player!.playerStats.threePoint.missed
              }
            />
            <StatsCard
              points={
                player!.playerStats.twoPoint.percentage.toFixed(
                  1,
                ) as unknown as number
              }
              label={"Two Points Pergentage"}
              percentage
              made={player!.playerStats.twoPoint.made}
              miss={player!.playerStats.twoPoint.missed}
            />
            <StatsCard
              points={
                player!.playerStats.threePoint.percentage.toFixed(
                  1,
                ) as unknown as number
              }
              label={"Three Points Pergentage"}
              percentage
              made={player!.playerStats.threePoint.made}
              miss={player!.playerStats.threePoint.missed}
            />
            <StatsCard
              points={
                player!.playerStats.freeThrow.percentage.toFixed(
                  1,
                ) as unknown as number
              }
              label={"Free Throw Pergentage"}
              percentage
              made={player!.playerStats.freeThrow.made}
              miss={player!.playerStats.freeThrow.missed}
            />
          </div>
        )}
      </div>
      {isFetched && (
        <div className="sm:hidden h-fit w-svw p-5 flex gap-5  flex-wrap items-stretch ">
          <StatsCard
            points={player!.playerStats.pir.toFixed(1) as unknown as number}
            label={"Performance Index Rating"}
          />

          {/* <StatsCard points={player.gamesPlayed} label={"Game Played"} /> */}
          <StatsCard
            points={player!.playerStats.points.toFixed(1) as unknown as number}
            label={"Points Per Game"}
          />
          <StatsCard
            points={player!.playerStats.assists}
            label={"Assists Per Game"}
          />
          <StatsCard
            points={player!.playerStats.rebounds}
            label={"Rebounds Per Game"}
          />
          <StatsCard
            points={player!.playerStats.offensiveRebounds}
            label={"Offensive Rebounds Per Game"}
          />
          <StatsCard
            points={player!.playerStats.defensiveRebounds}
            label={"Defensive Rebounds Per Game"}
          />
          <StatsCard
            points={player!.playerStats.steals}
            label={"Steals Per Game"}
          />
          <StatsCard
            points={player!.playerStats.blocks}
            label={"Block Per Game"}
          />
          <StatsCard
            points={player!.playerStats.receivedBlocks}
            label={"Received Blocks Per Game"}
          />
          <StatsCard
            points={player!.playerStats.turnovers}
            label={"Turnovers Per Game"}
          />
          <StatsCard
            points={player!.playerStats.personalFouls}
            label={"Personal Fouls Per Game"}
          />
          <StatsCard
            points={player!.playerStats.receivedFouls}
            label={"Received Fouls Per Game"}
          />
          <StatsCard
            points={player!.playerStats.technicalFouls}
            label={"Technical Fouls Per Game"}
          />
          <StatsCard
            points={
              (
                ((player!.playerStats.twoPoint.made +
                  player!.playerStats.threePoint.made) /
                  (player!.playerStats.twoPoint.missed +
                    player!.playerStats.threePoint.missed +
                    player!.playerStats.twoPoint.made +
                    player!.playerStats.threePoint.made)) *
                100
              ).toFixed(1) as unknown as number
            }
            label={"Field Goal Made"}
            percentage
            made={
              player!.playerStats.twoPoint.made +
              player!.playerStats.threePoint.made
            }
            miss={
              player!.playerStats.twoPoint.missed +
              player!.playerStats.threePoint.missed
            }
          />
          <StatsCard
            points={
              player!.playerStats.twoPoint.percentage.toFixed(
                1,
              ) as unknown as number
            }
            label={"Two Points Pergentage"}
            percentage
            made={player!.playerStats.twoPoint.made}
            miss={player!.playerStats.twoPoint.missed}
          />
          <StatsCard
            points={
              player!.playerStats.threePoint.percentage.toFixed(
                1,
              ) as unknown as number
            }
            label={"Three Points Pergentage"}
            percentage
            made={player!.playerStats.threePoint.made}
            miss={player!.playerStats.threePoint.missed}
          />
          <StatsCard
            points={
              player!.playerStats.freeThrow.percentage.toFixed(
                1,
              ) as unknown as number
            }
            label={"Free Throw Pergentage"}
            percentage
            made={player!.playerStats.freeThrow.made}
            miss={player!.playerStats.freeThrow.missed}
          />
        </div>
      )}
    </>
  );
};

export default PlayerPage;
