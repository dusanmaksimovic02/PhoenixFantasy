import { useLocation } from "react-router";
import { Player } from "../models/Player.model";
import StatsCard from "../components/StatsCard";

const PlayerPage = () => {
  const location = useLocation();
  const player = location.state?.player as Player;

  return (
    <>
      <div className="h-screen min-h-screen w-screen sm:pt-[5.5rem] bg-cover max-sm:bg-center bg-no-repeat bg-background flex sm:p-8 sm:gap-5 max-sm:w-svw max-sm:min-w-svw max-sm:pt-[3.5rem]" >
        <div className="bg-white dark:bg-black bg-opacity-70 dark:bg-opacity-70 h-full max-sm:w-svw max-sm:h-svh  flex flex-col gap-5 justify-center items-center p-8 sm:rounded-3xl whitespace-nowrap">
          <img
            src={player.photoUrl}
            alt="photo"
            className="w-[200px] h-[250px] max-sm:w-[300px] max-sm:h-[350px] rounded-3xl"
          />
          <p className="text-2xl text-phoenix font-bold text-nowrap">{`${player.firstName} ${player.lastName}`}</p>
          <div className="">
            <p>
              <strong>Country:</strong> {player.country}
            </p>
            <p>
              <strong>Age:</strong> {player.age}
            </p>
            <p>
              <strong className="text-nowrap">Team:</strong> {player.team}
            </p>
            <p>
              <strong>Jersey number: </strong>
              {player.jerseyNumber}
            </p>
            <p>
              <strong>Position: </strong>
              {player.pointsPerGame}
            </p>
            <p>
              <strong>Height: </strong>
              {player.height}
            </p>
            <p>
              <strong>Weight: </strong>
              {player.weight}
            </p>
          </div>
        </div>
        <div className=" max-sm:hidden h-full w-full p-5 max-sm:h-svh max-sm:w-svw flex gap-5  flex-wrap items-stretch max-sm:overflow-y-scroll overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-700 scrollbar-thumb-rounded-full scrollbar-track-rounded-full hover:scrollbar-thumb-gray-400 active:scrollbar-thumb-gray-300">
          <StatsCard points={player.pir} label={"Performace Index Rating"} />
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
