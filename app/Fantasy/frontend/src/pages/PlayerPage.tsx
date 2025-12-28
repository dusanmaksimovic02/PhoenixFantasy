import { useLocation } from "react-router-dom";
import { type Player } from "../models/Player.model";
import StatsCard from "../components/StatsCard";
import type { FC } from "react";

const PlayerPage: FC = () => {
  const location = useLocation();
  const player = location.state?.player as Player;

  return (
    <>
      <div className="h-screen min-h-screen w-screen sm:pt-16 flex  sm:gap-5 max-sm:w-svw max-sm:min-w-svw max-sm:pt-14 transition-all duration-1000">
        <div className="bg-phoenix h-full max-sm:w-svw max-sm:h-svh flex flex-col gap-5 justify-center items-center p-8 whitespace-nowrap text-white dark:text-black">
          <img
            src={player.photoUrl}
            alt="photo"
            className="w-50 h-62.5 max-sm:w-75 max-sm:h-87.5 "
          />
          <p className="text-2xl font-bold text-nowrap">{`${player.firstName} ${player.lastName}`}</p>
          <div className="">
            <p>
              <strong className="text-black dark:text-white">Country:</strong>{" "}
              {player.country}
            </p>
            <p>
              <strong className="text-black dark:text-white">Age:</strong>{" "}
              {player.age}
            </p>
            <p>
              <strong className="text-black dark:text-white">Team:</strong>{" "}
              {player.team}
            </p>
            <p>
              <strong className="text-black dark:text-white">
                Jersey number:{" "}
              </strong>
              {player.jerseyNumber}
            </p>
            <p>
              <strong className="text-black dark:text-white">Position: </strong>
              {player.pointsPerGame}
            </p>
            <p>
              <strong className="text-black dark:text-white">Height: </strong>
              {player.height}
            </p>
            <p>
              <strong className="text-black dark:text-white">Weight: </strong>
              {player.weight}
            </p>
          </div>
        </div>
        <div className="max-sm:hidden h-full w-full p-5 max-sm:h-svh max-sm:w-svw flex gap-5  flex-wrap items-stretch max-sm:overflow-y-scroll overflow-x-hidden">
          <StatsCard points={player.pir} label={"Performance Index Rating"} />
          <StatsCard points={player.plusMinusIndex} label={"+/-  Index"} />
          <StatsCard
            points={player.minutesPerGame}
            label={"Minutes Per Game"}
          />
          <StatsCard points={player.gamesPlayed} label={"Game Played"} />
          <StatsCard points={player.pointsPerGame} label={"Points Per Game"} />
          <StatsCard
            points={player.assistsPerGame}
            label={"Assists Per Game"}
          />
          <StatsCard
            points={player.reboundsPerGame}
            label={"Rebounds Per Game"}
          />
          <StatsCard points={player.stealsPerGame} label={"Steals Per Game"} />
          <StatsCard points={player.blocksPerGame} label={"Block Per Game"} />
          <StatsCard
            points={player.turnoversPerGame}
            label={"Turnovers Per Game"}
          />
          <StatsCard
            points={player.fieldGoalPercentage}
            label={"Field Goal Made"}
            percentage
            made={player.fieldGoalMade}
            miss={player.fieldGoalMiss}
          />
          <StatsCard
            points={player.twoPointsPercentage}
            label={"Two Points Pergentage"}
            percentage
            made={player.twoPointMade}
            miss={player.twoPointMiss}
          />
          <StatsCard
            points={player.threePointPercentage}
            label={"Three Points Pergentage"}
            percentage
            made={player.threePointMade}
            miss={player.threePointMiss}
          />
          <StatsCard
            points={player.freeThrowPercentage}
            label={"Free Throw Pergentage"}
            percentage
            made={player.freeThrowMade}
            miss={player.freeThrowMiss}
          />
        </div>
      </div>
      <div className="sm:hidden h-fit w-svw p-5 flex gap-5  flex-wrap items-stretch ">
        <StatsCard points={player.pir} label={"Performace Index Rating"} />
        <StatsCard points={player.plusMinusIndex} label={"+/-  Index"} />
        <StatsCard points={player.minutesPerGame} label={"Minutes Per Game"} />
        <StatsCard points={player.gamesPlayed} label={"Game Played"} />
        <StatsCard points={player.pointsPerGame} label={"Points Per Game"} />
        <StatsCard points={player.assistsPerGame} label={"Assists Per Game"} />
        <StatsCard
          points={player.reboundsPerGame}
          label={"Rebounds Per Game"}
        />
        <StatsCard points={player.stealsPerGame} label={"Steals Per Game"} />
        <StatsCard points={player.blocksPerGame} label={"Block Per Game"} />
        <StatsCard
          points={player.turnoversPerGame}
          label={"Turnovers Per Game"}
        />
        <StatsCard
          points={player.fieldGoalPercentage}
          label={"Field Goal Made"}
          percentage
          made={player.fieldGoalMade}
          miss={player.fieldGoalMiss}
        />
        <StatsCard
          points={player.twoPointsPercentage}
          label={"Two Points Pergentage"}
          percentage
          made={player.twoPointMade}
          miss={player.twoPointMiss}
        />
        <StatsCard
          points={player.threePointPercentage}
          label={"Three Points Pergentage"}
          percentage
          made={player.threePointMade}
          miss={player.threePointMiss}
        />
        <StatsCard
          points={player.freeThrowPercentage}
          label={"Free Throw Pergentage"}
          percentage
          made={player.freeThrowMade}
          miss={player.freeThrowMiss}
        />
      </div>
    </>
  );
};

export default PlayerPage;
