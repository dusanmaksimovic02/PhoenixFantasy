import type { FC } from "react";

const games = [
  {
    id: 1,
    homeTeam: "Phoenix Suns",
    homeLogo:
      "https://upload.wikimedia.org/wikipedia/en/d/dc/Phoenix_Suns_logo.svg",
    awayTeam: "Golden State Warriors",
    awayLogo:
      "https://upload.wikimedia.org/wikipedia/en/0/01/Golden_State_Warriors_logo.svg",
    date: "2024-10-15",
    time: "19:00",
    arena: "Footprint Center",
    played: true,
    result: { homeScore: 112, awayScore: 105 },
  },
  {
    id: 2,
    homeTeam: "Phoenix Suns",
    homeLogo:
      "https://upload.wikimedia.org/wikipedia/en/d/dc/Phoenix_Suns_logo.svg",
    awayTeam: "Los Angeles Lakers",
    awayLogo:
      "https://upload.wikimedia.org/wikipedia/commons/3/3c/Los_Angeles_Lakers_logo.svg",
    date: "2024-10-20",
    time: "20:30",
    arena: "Footprint Center",
    played: true,
    result: { homeScore: 98, awayScore: 104 },
  },
  {
    id: 3,
    homeTeam: "Boston Celtics",
    homeLogo:
      "https://upload.wikimedia.org/wikipedia/en/8/8f/Boston_Celtics.svg",
    awayTeam: "Phoenix Suns",
    awayLogo:
      "https://upload.wikimedia.org/wikipedia/en/d/dc/Phoenix_Suns_logo.svg",
    date: "2024-10-25",
    time: "19:30",
    arena: "TD Garden",
    played: true,
    result: { homeScore: 89, awayScore: 95 },
  },
  {
    id: 4,
    homeTeam: "Phoenix Suns",
    homeLogo:
      "https://upload.wikimedia.org/wikipedia/en/d/dc/Phoenix_Suns_logo.svg",
    awayTeam: "Milwaukee Bucks",
    awayLogo:
      "https://upload.wikimedia.org/wikipedia/en/4/4a/Milwaukee_Bucks_logo.svg",
    date: "2024-10-30",
    time: "21:00",
    arena: "Footprint Center",
    played: true,
    result: { homeScore: 101, awayScore: 108 },
  },
  {
    id: 5,
    homeTeam: "Miami Heat",
    homeLogo:
      "https://upload.wikimedia.org/wikipedia/en/f/fb/Miami_Heat_logo.svg",
    awayTeam: "Phoenix Suns",
    awayLogo:
      "https://upload.wikimedia.org/wikipedia/en/d/dc/Phoenix_Suns_logo.svg",
    date: "2024-11-03",
    time: "19:00",
    arena: "FTX Arena",
    played: true,
    result: { homeScore: 102, awayScore: 112 },
  },
  {
    id: 6,
    homeTeam: "Phoenix Suns",
    homeLogo:
      "https://upload.wikimedia.org/wikipedia/en/d/dc/Phoenix_Suns_logo.svg",
    awayTeam: "Dallas Mavericks",
    awayLogo:
      "https://upload.wikimedia.org/wikipedia/en/9/97/Dallas_Mavericks_logo.svg",
    date: "2024-11-07",
    time: "20:00",
    arena: "Footprint Center",
    played: true,
    result: { homeScore: 95, awayScore: 100 },
  },
  {
    id: 7,
    homeTeam: "Phoenix Suns",
    homeLogo:
      "https://upload.wikimedia.org/wikipedia/en/d/dc/Phoenix_Suns_logo.svg",
    awayTeam: "Philadelphia 76ers",
    awayLogo:
      "https://upload.wikimedia.org/wikipedia/en/0/0e/Philadelphia_76ers_logo.svg",
    date: "2024-11-10",
    time: "22:00",
    arena: "Footprint Center",
    played: true,
    result: { homeScore: 108, awayScore: 99 },
  },
  {
    id: 8,
    homeTeam: "Denver Nuggets",
    homeLogo:
      "https://upload.wikimedia.org/wikipedia/en/7/76/Denver_Nuggets.svg",
    awayTeam: "Phoenix Suns",
    awayLogo:
      "https://upload.wikimedia.org/wikipedia/en/d/dc/Phoenix_Suns_logo.svg",
    date: "2024-11-15",
    time: "19:30",
    arena: "Ball Arena",
    played: true,
    result: { homeScore: 99, awayScore: 103 },
  },
  {
    id: 9,
    homeTeam: "Phoenix Suns",
    homeLogo:
      "https://upload.wikimedia.org/wikipedia/en/d/dc/Phoenix_Suns_logo.svg",
    awayTeam: "Chicago Bulls",
    awayLogo:
      "https://upload.wikimedia.org/wikipedia/en/6/67/Chicago_Bulls_logo.svg",
    date: "2024-11-20",
    time: "20:30",
    arena: "Footprint Center",
    played: true,
    result: { homeScore: 120, awayScore: 115 },
  },
  {
    id: 10,
    homeTeam: "Toronto Raptors",
    homeLogo:
      "https://upload.wikimedia.org/wikipedia/en/2/28/Toronto_Raptors_logo.svg",
    awayTeam: "Phoenix Suns",
    awayLogo:
      "https://upload.wikimedia.org/wikipedia/en/d/dc/Phoenix_Suns_logo.svg",
    date: "2024-11-25",
    time: "19:00",
    arena: "Scotiabank Arena",
    played: true,
    result: { homeScore: 98, awayScore: 92 },
  },
  {
    id: 11,
    homeTeam: "Phoenix Suns",
    homeLogo:
      "https://upload.wikimedia.org/wikipedia/en/d/dc/Phoenix_Suns_logo.svg",
    awayTeam: "New York Knicks",
    awayLogo:
      "https://upload.wikimedia.org/wikipedia/en/2/25/New_York_Knicks_logo.svg",
    date: "2024-11-30",
    time: "19:30",
    arena: "Footprint Center",
    played: true,
    result: { homeScore: 105, awayScore: 100 },
  },
  {
    id: 12,
    homeTeam: "Atlanta Hawks",
    homeLogo:
      "https://upload.wikimedia.org/wikipedia/en/2/24/Atlanta_Hawks_logo.svg",
    awayTeam: "Phoenix Suns",
    awayLogo:
      "https://upload.wikimedia.org/wikipedia/en/d/dc/Phoenix_Suns_logo.svg",
    date: "2024-12-05",
    time: "20:00",
    arena: "State Farm Arena",
    played: true,
    result: { homeScore: 110, awayScore: 112 },
  },
  {
    id: 13,
    homeTeam: "Phoenix Suns",
    homeLogo:
      "https://upload.wikimedia.org/wikipedia/en/d/dc/Phoenix_Suns_logo.svg",
    awayTeam: "Brooklyn Nets",
    awayLogo:
      "https://upload.wikimedia.org/wikipedia/en/4/44/Brooklyn_Nets_newlogo.svg",
    date: "2024-12-10",
    time: "21:00",
    arena: "Footprint Center",
    played: false,
    result: null,
  },
  {
    id: 14,
    homeTeam: "Houston Rockets",
    homeLogo:
      "https://upload.wikimedia.org/wikipedia/en/2/28/Houston_Rockets.svg",
    awayTeam: "Phoenix Suns",
    awayLogo:
      "https://upload.wikimedia.org/wikipedia/en/d/dc/Phoenix_Suns_logo.svg",
    date: "2024-12-15",
    time: "19:30",
    arena: "Toyota Center",
    played: false,
    result: null,
  },
  {
    id: 15,
    homeTeam: "Phoenix Suns",
    homeLogo:
      "https://upload.wikimedia.org/wikipedia/en/d/dc/Phoenix_Suns_logo.svg",
    awayTeam: "San Antonio Spurs",
    awayLogo:
      "https://upload.wikimedia.org/wikipedia/en/a/a2/San_Antonio_Spurs.svg",
    date: "2024-12-20",
    time: "20:00",
    arena: "Footprint Center",
    played: false,
    result: null,
  },
  {
    id: 16,
    homeTeam: "Utah Jazz",
    homeLogo:
      "https://upload.wikimedia.org/wikipedia/en/c/c2/Utah_Jazz_primary_logo_%282023%29.svg",
    awayTeam: "Phoenix Suns",
    awayLogo:
      "https://upload.wikimedia.org/wikipedia/en/d/dc/Phoenix_Suns_logo.svg",
    date: "2024-12-25",
    time: "21:00",
    arena: "Vivint Arena",
    played: false,
    result: null,
  },
  {
    id: 17,
    homeTeam: "Phoenix Suns",
    homeLogo:
      "https://upload.wikimedia.org/wikipedia/en/d/dc/Phoenix_Suns_logo.svg",
    awayTeam: "Orlando Magic",
    awayLogo:
      "https://upload.wikimedia.org/wikipedia/en/c/cb/Orlando_Magic_logo.svg",
    date: "2024-12-30",
    time: "19:00",
    arena: "Footprint Center",
    played: false,
    result: null,
  },
  {
    id: 18,
    homeTeam: "Memphis Grizzlies",
    homeLogo:
      "https://upload.wikimedia.org/wikipedia/en/f/f1/Memphis_Grizzlies.svg",
    awayTeam: "Phoenix Suns",
    awayLogo:
      "https://upload.wikimedia.org/wikipedia/en/d/dc/Phoenix_Suns_logo.svg",
    date: "2025-01-05",
    time: "19:00",
    arena: "Footprint Center",
    played: false,
    result: null,
  },
  {
    id: 19,
    homeTeam: "Phoenix Suns",
    homeLogo:
      "https://upload.wikimedia.org/wikipedia/en/d/dc/Phoenix_Suns_logo.svg",
    awayTeam: "Sacramento Kings",
    awayLogo:
      "https://upload.wikimedia.org/wikipedia/en/c/c7/SacramentoKings.svg",
    date: "2025-01-10",
    time: "20:00",
    arena: "Golden 1 Center",
    played: false,
    result: null,
  },
];

const Games:FC = () => {
  return (
    <div className="flex flex-col gap-5">
      {games.map((game, index) => (
        <div
          key={index}
          className="flex max-sm:flex-col justify-between items-center gap-5 p-5 bg-surface-light dark:bg-surface-dark/70 rounded-3xl "
        >
          <div className="flex justify-center items-center flex-col gap-3 text-center">
            <img src={game.homeLogo} alt={`${game.homeTeam} logo`} className="w-36 h-36" />
            <p className="text-2xl text-phoenix font-extrabold">
              {game.homeTeam}
            </p>
          </div>
          <div className=" flex flex-col gap-5">
            {game.result && (
              <div className=" flex text-5xl">
                <div
                  className={`border-2 border-r-0 p-5 ${
                    game.homeTeam === "Phoenix Suns" &&
                    (game.result.homeScore > game.result.awayScore
                      ? "bg-success"
                      : "bg-error")
                  }`}
                >
                  {game.result.homeScore}
                </div>
                <div
                  className={`border-2 p-5 ${
                    game.awayTeam === "Phoenix Suns" &&
                    (game.result.awayScore > game.result.homeScore
                      ? "bg-success"
                      : "bg-error")
                  }`}
                >
                  {game.result.awayScore}
                </div>
              </div>
            )}
            <div className="flex flex-col text-center font-semibold">
              <p>{game.date}</p>
              <p>{game.time}</p>
              <p>{game.arena}</p>
            </div>
          </div>
          <div className="flex justify-center items-center flex-col gap-3 text-center">
            <img src={game.awayLogo} alt="home logo" className="w-36 h-36" />
            <p className="text-2xl text-phoenix font-extrabold">
              {game.awayTeam}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Games;
