import { useParams } from "react-router";
import { Tabs } from "@material-tailwind/react";
import GameInfo from "../components/GamePage/GameInfo";
import PlayersStats from "../components/TeamPage/PlayersStats";
import TeamStats from "../components/GamePage/TeamStats";

const GamePage = () => {
  const { team1, team2 } = useParams();

  const game = {
    homeTeam: team1,
    homeLogo:
      "https://upload.wikimedia.org/wikipedia/en/d/dc/Phoenix_Suns_logo.svg",
    awayTeam: team2,
    awayLogo:
      "https://upload.wikimedia.org/wikipedia/en/0/01/Golden_State_Warriors_logo.svg",
    date: "2024-10-15",
    time: "19:00",
    arena: "Footprint Center",
    played: true,
    result: { homeScore: 112, awayScore: 105 },
    referees: ["ref1", "ref2", "ref3"],
  };

  const players = Array.from({ length: 10 }, (_, index) => ({
    id: index + 1,
    firstName: `Player${index + 1}`,
    lastName: `Suns`,
    team: "Phoenix Suns",
    country: "USA",
    age: 20 + index,
    position: ["PG", "SG", "SF", "PF", "C"][index % 5],
    height: `${6 + (index % 3)}'${5 + (index % 6)}`,
    weight: `${200 + index * 5} lbs`,
    photoUrl:
      "https://upload.wikimedia.org/wikipedia/commons/7/7a/LeBron_James_%2851959977144%29_%28cropped2%29.jpg",
    gamesPlayed: 50 + index,
    pointsPerGame: 10 + index * 0.5,
    reboundsPerGame: 5 + index * 0.3,
    assistsPerGame: 2 + index * 0.2,
    stealsPerGame: 1 + index * 0.1,
    blocksPerGame: 0.5 + index * 0.05,
    fieldGoalPercentage: 45 + index * 0.5,
    fieldGoalMade: 300 + index * 5,
    fieldGoalMiss: 150 + index * 3,
    threePointPercentage: 35 + index * 0.3,
    threePointMade: 120 + index * 2,
    threePointMiss: 60 + index * 2,
    twoPointsPercentage: 40 + index * 0.3,
    twoPointMade: 180 + index * 3,
    twoPointMiss: 90 + index * 2,
    freeThrowPercentage: 80 + index * 0.2,
    freeThrowMade: 100 + index,
    freeThrowMiss: 20 + index,
    turnoversPerGame: 2 + index * 0.1,
    minutesPerGame: 20 + index,
    jerseyNumber: 10 + (index % 30),
    plusMinusIndex: 5 - index * 0.5,
    pir:
      10 +
      index * 0.5 +
      (5 + index * 0.3) +
      (2 + index * 0.2) +
      (1 + index * 0.1) +
      (0.5 + index * 0.05) -
      (2 + index * 0.1),
  }));

  return (
    <>
      <div className="pt-[3.5rem] h-fit w-screen font-palanquin min-h-screen">
        <div className="max-sm:bg-center bg-cover bg-no-repeat bg-background h-fit w-full sm:py-20 sm:px-10 max-sm:h-svh">
          <div className="h-fit flex max-sm:flex-col justify-between items-center gap-5 bg-black bg-opacity-60 p-5 text-white  max-sm:h-svh max-sm:justify-around">
            <div className="w-full flex max-sm:flex-col justify-between items-center gap-5 p-5  rounded-3xl ">
              <div className="flex justify-center items-center flex-col gap-3 text-center">
                <img
                  src={game.homeLogo}
                  alt="home logo"
                  className="w-36 h-36"
                />
                <p className="text-2xl text-phoenix font-extrabold">
                  {game.homeTeam}
                </p>
              </div>
              <div className=" flex flex-col gap-5">
                {game.result && (
                  <div className=" flex text-5xl">
                    <div
                      className={`border-2 border-r-0 p-5 ${
                        game.result.homeScore > game.result.awayScore
                          ? "bg-success"
                          : "bg-transparent"
                      }`}
                    >
                      {game.result.homeScore}
                    </div>
                    <div
                      className={`border-2 p-5 ${
                        game.result.awayScore > game.result.homeScore
                          ? "bg-success"
                          : "bg-transparent"
                      }`}
                    >
                      {game.result.awayScore}
                    </div>
                  </div>
                )}
                <div className="flex flex-col text-center font-semibold">
                  <p>Time: {game.time}</p>
                  <p>Date: {game.date}</p>
                  <p>Arena: {game.arena}</p>
                  <p>
                    Referees:{" "}
                    {game.referees.map((ref) => (
                      <>{ref} </>
                    ))}
                  </p>
                </div>
              </div>
              <div className="flex justify-center items-center flex-col gap-3 text-center">
                <img
                  src={game.awayLogo}
                  alt="home logo"
                  className="w-36 h-36"
                />
                <p className="text-2xl text-phoenix font-extrabold">
                  {game.awayTeam}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="">
          <Tabs defaultValue="game-info">
            <Tabs.List className="w-full">
              <Tabs.Trigger
                className="w-full aria-selected:text-white"
                value="game-info"
              >
                Game info
              </Tabs.Trigger>
              <Tabs.Trigger
                className="w-full aria-selected:text-white"
                value="team2-stats"
              >
                Team stats
              </Tabs.Trigger>
              <Tabs.Trigger
                className="w-full aria-selected:text-white"
                value="players1-stats"
              >
                {game.homeTeam} players stats
              </Tabs.Trigger>
              <Tabs.Trigger
                className="w-full aria-selected:text-white"
                value="players2-stats"
              >
                {game.awayTeam} players stats
              </Tabs.Trigger>
              <Tabs.TriggerIndicator className="" />
            </Tabs.List>
            <Tabs.Panel value="game-info" className="p-5 sm:text-[1.rem]">
              <GameInfo />
            </Tabs.Panel>
            <Tabs.Panel value="players1-stats" className="p-5">
              <PlayersStats players={players} />
            </Tabs.Panel>
            <Tabs.Panel value="players2-stats" className="p-5">
              <PlayersStats players={players} />
            </Tabs.Panel>
            <Tabs.Panel value="team1-stats" className="p-5">
              <TeamStats />
            </Tabs.Panel>
            <Tabs.Panel value="team2-stats" className="p-5">
              <TeamStats />
            </Tabs.Panel>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default GamePage;
