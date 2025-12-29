import type { FC } from "react";
import TopPlayerCard from "./TopPlayerCard";

export type Player = {
  fullName: string;
  team: string;
  fantasyPointsPerGame: number;
  pointsPerGame: number;
  reboundsPerGame: number;
  assistsPerGame: number;
  imageUrl: string;
};
const TopPlayer: FC = () => {
  const bestPlayers: Player[] = [
    {
      fullName: "LeBron James",
      team: "Los Angeles Lakers",
      fantasyPointsPerGame: 55.4,
      pointsPerGame: 25.0,
      reboundsPerGame: 7.8,
      assistsPerGame: 7.4,
      imageUrl:
        "https://upload.wikimedia.org/wikipedia/commons/7/7a/LeBron_James_%2851959977144%29_%28cropped2%29.jpg",
    },
    {
      fullName: "Giannis Antetokounmpo",
      team: "Milwaukee Bucks",
      fantasyPointsPerGame: 59.7,
      pointsPerGame: 28.0,
      reboundsPerGame: 11.2,
      assistsPerGame: 5.8,
      imageUrl:
        "https://upload.wikimedia.org/wikipedia/commons/7/7a/LeBron_James_%2851959977144%29_%28cropped2%29.jpg",
    },
    {
      fullName: "Luka Dončić",
      team: "Dallas Mavericks",
      fantasyPointsPerGame: 57.9,
      pointsPerGame: 32.5,
      reboundsPerGame: 8.2,
      assistsPerGame: 9.0,
      imageUrl:
        "https://upload.wikimedia.org/wikipedia/commons/7/7a/LeBron_James_%2851959977144%29_%28cropped2%29.jpg",
    },
    {
      fullName: "Joel Embiid",
      team: "Philadelphia 76ers",
      fantasyPointsPerGame: 58.2,
      pointsPerGame: 33.0,
      reboundsPerGame: 10.2,
      assistsPerGame: 4.5,
      imageUrl:
        "https://upload.wikimedia.org/wikipedia/commons/7/7a/LeBron_James_%2851959977144%29_%28cropped2%29.jpg",
    },
    {
      fullName: "Nikola Jokić",
      team: "Denver Nuggets",
      fantasyPointsPerGame: 60.3,
      pointsPerGame: 26.5,
      reboundsPerGame: 11.7,
      assistsPerGame: 9.0,
      imageUrl:
        "https://upload.wikimedia.org/wikipedia/commons/7/7a/LeBron_James_%2851959977144%29_%28cropped2%29.jpg",
    },
    {
      fullName: "Kevin Durant",
      team: "Phoenix Suns",
      fantasyPointsPerGame: 53.5,
      pointsPerGame: 29.1,
      reboundsPerGame: 6.7,
      assistsPerGame: 5.0,
      imageUrl:
        "https://upload.wikimedia.org/wikipedia/commons/7/7a/LeBron_James_%2851959977144%29_%28cropped2%29.jpg",
    },
    {
      fullName: "Stephen Curry",
      team: "Golden State Warriors",
      fantasyPointsPerGame: 56.1,
      pointsPerGame: 30.1,
      reboundsPerGame: 6.2,
      assistsPerGame: 6.5,
      imageUrl:
        "https://upload.wikimedia.org/wikipedia/commons/7/7a/LeBron_James_%2851959977144%29_%28cropped2%29.jpg",
    },
    {
      fullName: "James Harden",
      team: "Philadelphia 76ers",
      fantasyPointsPerGame: 51.3,
      pointsPerGame: 22.6,
      reboundsPerGame: 6.1,
      assistsPerGame: 10.8,
      imageUrl:
        "https://upload.wikimedia.org/wikipedia/commons/7/7a/LeBron_James_%2851959977144%29_%28cropped2%29.jpg",
    },
    {
      fullName: "Anthony Davis",
      team: "Los Angeles Lakers",
      fantasyPointsPerGame: 52.4,
      pointsPerGame: 24.2,
      reboundsPerGame: 10.3,
      assistsPerGame: 2.5,
      imageUrl:
        "https://upload.wikimedia.org/wikipedia/commons/7/7a/LeBron_James_%2851959977144%29_%28cropped2%29.jpg",
    },
    {
      fullName: "Kawhi Leonard",
      team: "Los Angeles Clippers",
      fantasyPointsPerGame: 49.5,
      pointsPerGame: 27.1,
      reboundsPerGame: 7.3,
      assistsPerGame: 5.0,
      imageUrl:
        "https://upload.wikimedia.org/wikipedia/commons/7/7a/LeBron_James_%2851959977144%29_%28cropped2%29.jpg",
    },
    {
      fullName: "Jimmy Butler",
      team: "Miami Heat",
      fantasyPointsPerGame: 48.2,
      pointsPerGame: 21.4,
      reboundsPerGame: 6.9,
      assistsPerGame: 5.5,
      imageUrl:
        "https://upload.wikimedia.org/wikipedia/commons/7/7a/LeBron_James_%2851959977144%29_%28cropped2%29.jpg",
    },
    {
      fullName: "Zion Williamson",
      team: "New Orleans Pelicans",
      fantasyPointsPerGame: 50.7,
      pointsPerGame: 26.3,
      reboundsPerGame: 7.0,
      assistsPerGame: 3.6,
      imageUrl:
        "https://upload.wikimedia.org/wikipedia/commons/7/7a/LeBron_James_%2851959977144%29_%28cropped2%29.jpg",
    },
    {
      fullName: "Jayson Tatum",
      team: "Boston Celtics",
      fantasyPointsPerGame: 54.2,
      pointsPerGame: 30.5,
      reboundsPerGame: 8.0,
      assistsPerGame: 4.2,
      imageUrl:
        "https://upload.wikimedia.org/wikipedia/commons/7/7a/LeBron_James_%2851959977144%29_%28cropped2%29.jpg",
    },
    {
      fullName: "Trae Young",
      team: "Atlanta Hawks",
      fantasyPointsPerGame: 48.9,
      pointsPerGame: 27.0,
      reboundsPerGame: 4.0,
      assistsPerGame: 9.3,
      imageUrl:
        "https://upload.wikimedia.org/wikipedia/commons/7/7a/LeBron_James_%2851959977144%29_%28cropped2%29.jpg",
    },
    {
      fullName: "Devin Booker",
      team: "Phoenix Suns",
      fantasyPointsPerGame: 49.6,
      pointsPerGame: 28.0,
      reboundsPerGame: 4.5,
      assistsPerGame: 5.6,
      imageUrl:
        "https://upload.wikimedia.org/wikipedia/commons/7/7a/LeBron_James_%2851959977144%29_%28cropped2%29.jpg",
    },
  ];

  return (
    <>
      <h1 className="text-black dark:text-white font-extrabold text-4xl p-5 pt-0 px-24 max-sm:px-5 ">
        Top <span className="text-phoenix">Performers</span> For <span className="text-phoenix"> Your Team</span>
      </h1>
      <div className="px-5">
        <div className="p-5 pt-10 flex gap-10 flex-col max-sm:justify-center max-sm:items-center font-palanquin px-24 max-sm:px-5">
          <div>
            <h1 className="text-black dark:text-white font-extrabold text-4xl max-sm:px-0">
              <span className="text-phoenix">Based</span> on the{" "}
              <span className="text-phoenix">previous round</span>
            </h1>
          </div>
          <div className="flex gap-10 justify-around p-8 snap-x snap-mandatory overflow-x-auto max-sm:w-svw ">
            {bestPlayers.map((player, index) => (
              <TopPlayerCard key={index} player={player} />
            ))}
          </div>
        </div>
        <div className="p-5 pt-10 flex gap-10 flex-col max-sm:justify-center max-sm:items-center font-palanquin px-24 max-sm:px-5">
          <div>
            <h1 className="text-black dark:text-white font-extrabold text-4xl s">
              <span className="text-phoenix">Based</span> on the
              <span className="text-phoenix"> whole part</span> of the
              <span className="text-phoenix"> season so far</span>
            </h1>
          </div>
          <div className="flex gap-10 justify-around p-8 snap-x snap-mandatory overflow-x-auto max-sm:w-svw ">
            {bestPlayers.map((player, index) => (
              <TopPlayerCard key={index} player={player} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default TopPlayer;
