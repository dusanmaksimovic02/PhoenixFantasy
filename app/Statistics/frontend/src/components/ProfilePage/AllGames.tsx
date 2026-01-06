import type { User } from "../../models/User";
import { useState, type FC } from "react";

const tableHead = [
  "",
  "Id",
  "Home Team",
  "Away Team",
  "Date",
  "Time",
  "Venue",
  "Referee",
];

const AllGames: FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const [selectedGame, setSelectedGame] = useState<{
    id: string;
    homeTeam: string;
    awayTeam: string;
    dateTime: Date;
    venue: string;
    referee: User;
  } | null>(null);

  const formatDate = (date: Date) => date.toISOString().slice(0, 10);

  const formatTime = (date: Date) => date.toISOString().slice(11, 16);

  const games: {
    id: string;
    homeTeam: string;
    awayTeam: string;
    dateTime: Date;
    venue: string;
    referee: User;
  }[] = [
    {
      id: "1",
      homeTeam: "Home Team",
      awayTeam: "Away Team",
      dateTime: new Date(),
      venue: "Venue",
      referee: {
        id: "1",
        email: "referee1@gmail.com",
        password: "#Sifra123",
        name: "Referee",
        surname: "1",
        username: "referee1",
        birthDate: new Date(),
        phone: "+381646353265",
        gender: "male",
        role: "referee",
      },
    },
    {
      id: "1",
      homeTeam: "Home Team",
      awayTeam: "Away Team",
      dateTime: new Date(),
      venue: "Venue",
      referee: {
        id: "1",
        email: "referee1@gmail.com",
        password: "#Sifra123",
        name: "Referee",
        surname: "1",
        username: "referee1",
        birthDate: new Date(),
        phone: "+381646353265",
        gender: "male",
        role: "referee",
      },
    },
    {
      id: "1",
      homeTeam: "Home Team",
      awayTeam: "Away Team",
      dateTime: new Date(),
      venue: "Venue",
      referee: {
        id: "1",
        email: "referee1@gmail.com",
        password: "#Sifra123",
        name: "Referee",
        surname: "1",
        username: "referee1",
        birthDate: new Date(),
        phone: "+381646353265",
        gender: "male",
        role: "referee",
      },
    },
    {
      id: "1",
      homeTeam: "Home Team",
      awayTeam: "Away Team",
      dateTime: new Date(),
      venue: "Venue",
      referee: {
        id: "1",
        email: "referee1@gmail.com",
        password: "#Sifra123",
        name: "Referee",
        surname: "1",
        username: "referee1",
        birthDate: new Date(),
        phone: "+381646353265",
        gender: "male",
        role: "referee",
      },
    },
    {
      id: "1",
      homeTeam: "Home Team",
      awayTeam: "Away Team",
      dateTime: new Date(),
      venue: "Venue",
      referee: {
        id: "1",
        email: "referee1@gmail.com",
        password: "#Sifra123",
        name: "Referee",
        surname: "1",
        username: "referee1",
        birthDate: new Date(),
        phone: "+381646353265",
        gender: "male",
        role: "referee",
      },
    },
    {
      id: "1",
      homeTeam: "Home Team",
      awayTeam: "Away Team",
      dateTime: new Date(),
      venue: "Venue",
      referee: {
        id: "1",
        email: "referee1@gmail.com",
        password: "#Sifra123",
        name: "Referee",
        surname: "1",
        username: "referee1",
        birthDate: new Date(),
        phone: "+381646353265",
        gender: "male",
        role: "referee",
      },
    },
    {
      id: "1",
      homeTeam: "Home Team",
      awayTeam: "Away Team",
      dateTime: new Date(),
      venue: "Venue",
      referee: {
        id: "1",
        email: "referee1@gmail.com",
        password: "#Sifra123",
        name: "Referee",
        surname: "1",
        username: "referee1",
        birthDate: new Date(),
        phone: "+381646353265",
        gender: "male",
        role: "referee",
      },
    },
    {
      id: "1",
      homeTeam: "Home Team",
      awayTeam: "Away Team",
      dateTime: new Date(),
      venue: "Venue",
      referee: {
        id: "1",
        email: "referee1@gmail.com",
        password: "#Sifra123",
        name: "Referee",
        surname: "1",
        username: "referee1",
        birthDate: new Date(),
        phone: "+381646353265",
        gender: "male",
        role: "referee",
      },
    },
    {
      id: "1",
      homeTeam: "Home Team",
      awayTeam: "Away Team",
      dateTime: new Date(),
      venue: "Venue",
      referee: {
        id: "1",
        email: "referee1@gmail.com",
        password: "#Sifra123",
        name: "Referee",
        surname: "1",
        username: "referee1",
        birthDate: new Date(),
        phone: "+381646353265",
        gender: "male",
        role: "referee",
      },
    },
    {
      id: "1",
      homeTeam: "Home Team",
      awayTeam: "Away Team",
      dateTime: new Date(),
      venue: "Venue",
      referee: {
        id: "1",
        email: "referee1@gmail.com",
        password: "#Sifra123",
        name: "Referee",
        surname: "1",
        username: "referee1",
        birthDate: new Date(),
        phone: "+381646353265",
        gender: "male",
        role: "referee",
      },
    },
    {
      id: "1",
      homeTeam: "Home Team",
      awayTeam: "Away Team",
      dateTime: new Date(),
      venue: "Venue",
      referee: {
        id: "1",
        email: "referee1@gmail.com",
        password: "#Sifra123",
        name: "Referee",
        surname: "1",
        username: "referee1",
        birthDate: new Date(),
        phone: "+381646353265",
        gender: "male",
        role: "referee",
      },
    },
    {
      id: "1",
      homeTeam: "Home Team",
      awayTeam: "Away Team",
      dateTime: new Date(),
      venue: "Venue",
      referee: {
        id: "1",
        email: "referee1@gmail.com",
        password: "#Sifra123",
        name: "Referee",
        surname: "1",
        username: "referee1",
        birthDate: new Date(),
        phone: "+381646353265",
        gender: "male",
        role: "referee",
      },
    },
    {
      id: "1",
      homeTeam: "Home Team",
      awayTeam: "Away Team",
      dateTime: new Date(),
      venue: "Venue",
      referee: {
        id: "1",
        email: "referee1@gmail.com",
        password: "#Sifra123",
        name: "Referee",
        surname: "1",
        username: "referee1",
        birthDate: new Date(),
        phone: "+381646353265",
        gender: "male",
        role: "referee",
      },
    },
    {
      id: "1",
      homeTeam: "Home Team",
      awayTeam: "Away Team",
      dateTime: new Date(),
      venue: "Venue",
      referee: {
        id: "1",
        email: "referee1@gmail.com",
        password: "#Sifra123",
        name: "Referee",
        surname: "1",
        username: "referee1",
        birthDate: new Date(),
        phone: "+381646353265",
        gender: "male",
        role: "referee",
      },
    },
    {
      id: "1",
      homeTeam: "Home Team",
      awayTeam: "Away Team",
      dateTime: new Date(),
      venue: "Venue",
      referee: {
        id: "1",
        email: "referee1@gmail.com",
        password: "#Sifra123",
        name: "Referee",
        surname: "1",
        username: "referee1",
        birthDate: new Date(),
        phone: "+381646353265",
        gender: "male",
        role: "referee",
      },
    },
    {
      id: "1",
      homeTeam: "Home Team",
      awayTeam: "Away Team",
      dateTime: new Date(),
      venue: "Venue",
      referee: {
        id: "1",
        email: "referee1@gmail.com",
        password: "#Sifra123",
        name: "Referee",
        surname: "1",
        username: "referee1",
        birthDate: new Date(),
        phone: "+381646353265",
        gender: "male",
        role: "referee",
      },
    },
    {
      id: "1",
      homeTeam: "Home Team",
      awayTeam: "Away Team",
      dateTime: new Date(),
      venue: "Venue",
      referee: {
        id: "1",
        email: "referee1@gmail.com",
        password: "#Sifra123",
        name: "Referee",
        surname: "1",
        username: "referee1",
        birthDate: new Date(),
        phone: "+381646353265",
        gender: "male",
        role: "referee",
      },
    },
    {
      id: "1",
      homeTeam: "Home Team",
      awayTeam: "Away Team",
      dateTime: new Date(),
      venue: "Venue",
      referee: {
        id: "1",
        email: "referee1@gmail.com",
        password: "#Sifra123",
        name: "Referee",
        surname: "1",
        username: "referee1",
        birthDate: new Date(),
        phone: "+381646353265",
        gender: "male",
        role: "referee",
      },
    },
    {
      id: "1",
      homeTeam: "Home Team",
      awayTeam: "Away Team",
      dateTime: new Date(),
      venue: "Venue",
      referee: {
        id: "1",
        email: "referee1@gmail.com",
        password: "#Sifra123",
        name: "Referee",
        surname: "1",
        username: "referee1",
        birthDate: new Date(),
        phone: "+381646353265",
        gender: "male",
        role: "referee",
      },
    },
    {
      id: "1",
      homeTeam: "Home Team",
      awayTeam: "Away Team",
      dateTime: new Date(),
      venue: "Venue",
      referee: {
        id: "1",
        email: "referee1@gmail.com",
        password: "#Sifra123",
        name: "Referee",
        surname: "1",
        username: "referee1",
        birthDate: new Date(),
        phone: "+381646353265",
        gender: "male",
        role: "referee",
      },
    },
    {
      id: "1",
      homeTeam: "Home Team",
      awayTeam: "Away Team",
      dateTime: new Date(),
      venue: "Venue",
      referee: {
        id: "1",
        email: "referee1@gmail.com",
        password: "#Sifra123",
        name: "Referee",
        surname: "1",
        username: "referee1",
        birthDate: new Date(),
        phone: "+381646353265",
        gender: "male",
        role: "referee",
      },
    },
    {
      id: "1",
      homeTeam: "Home Team",
      awayTeam: "Away Team",
      dateTime: new Date(),
      venue: "Venue",
      referee: {
        id: "1",
        email: "referee1@gmail.com",
        password: "#Sifra123",
        name: "Referee",
        surname: "1",
        username: "referee1",
        birthDate: new Date(),
        phone: "+381646353265",
        gender: "male",
        role: "referee",
      },
    },
    {
      id: "1",
      homeTeam: "Home Team",
      awayTeam: "Away Team",
      dateTime: new Date(),
      venue: "Venue",
      referee: {
        id: "1",
        email: "referee1@gmail.com",
        password: "#Sifra123",
        name: "Referee",
        surname: "1",
        username: "referee1",
        birthDate: new Date(),
        phone: "+381646353265",
        gender: "male",
        role: "referee",
      },
    },
  ];

  return (
    <div className="w-full h-fit mt-10 border border-surface overflow-x-auto">
      <table className="w-full">
        <thead className="border-[3px] border-surface bg-surface-light text-lg font-medium text-foreground  dark:bg-surface-dark">
          <tr>
            {tableHead.map((head) => (
              <th key={head} className="px-2.5 py-2  text-start  font-medium">
                {head}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="text-sm text-black dark:text-white ">
          {games.map((game) => (
            <tr
              key={game.id}
              className="tooltip table-row  border-[3px] border-surface whitespace-nowrap cursor-pointer"
              data-tip="click to edit game"
              onClick={() => {
                setIsOpen(true);
                setSelectedGame(game);
              }}
            >
              <td className="p-3 cursor-pointer">{game.id}</td>
              <td className="p-3 cursor-pointer">{game.homeTeam}</td>
              <td className="p-3 cursor-pointer">{game.awayTeam}</td>
              <td className="p-3 cursor-pointer">
                {game.dateTime.toDateString()}
              </td>
              <td className="p-3 cursor-pointer">
                {game.dateTime.toTimeString()}
              </td>
              <td className="p-3 cursor-pointer">{game.venue}</td>
              <td className="p-3 cursor-pointer">
                {game.referee.name} {game.referee.surname}{" "}
                {game.referee.username}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {isOpen && selectedGame && (
        <dialog open={isOpen} className="modal">
          <div className="modal-box w-6/12 max-w-5xl bg-white dark:bg-custom-gray">
            <div className="modal-action text flex flex-col gap-10">
              <button
                type="button"
                className="btn btn-sm text-red-600 btn-circle btn-ghost absolute right-2 top-2"
                onClick={() => {
                  setIsOpen(false);
                }}
              >
                ✕
              </button>

              <h3 className="text-nowrap w-full text-center">
                Edit game details
              </h3>

              <div className="flex flex-col gap-4">
                <div>
                  <label>Date</label>
                  <input
                    type="date"
                    className="input input-bordered w-full"
                    value={formatDate(selectedGame.dateTime)}
                    onChange={(e) =>
                      setSelectedGame({
                        ...selectedGame,
                        dateTime: new Date(
                          `${e.target.value}T${formatTime(
                            selectedGame.dateTime
                          )}`
                        ),
                      })
                    }
                  />
                </div>

                <div>
                  <label>Time</label>
                  <input
                    type="time"
                    className="input input-bordered w-full"
                    value={formatTime(selectedGame.dateTime)}
                    onChange={(e) =>
                      setSelectedGame({
                        ...selectedGame,
                        dateTime: new Date(
                          `${formatDate(selectedGame.dateTime)}T${
                            e.target.value
                          }`
                        ),
                      })
                    }
                  />
                </div>

                <div>
                  <label>Venue</label>
                  <input
                    type="text"
                    className="input input-bordered w-full"
                    value={selectedGame.venue}
                    onChange={(e) =>
                      setSelectedGame({
                        ...selectedGame,
                        venue: e.target.value,
                      })
                    }
                  />
                </div>

                <div>
                  <label>Referee</label>
                  <input
                    type="text"
                    className="input input-bordered w-full"
                    value={`${selectedGame.referee.name} ${selectedGame.referee.surname}`}
                    onChange={(e) =>
                      setSelectedGame({
                        ...selectedGame,
                        referee: {
                          ...selectedGame.referee,
                          name: e.target.value,
                        },
                      })
                    }
                  />
                </div>
              </div>

              <div className="flex justify-between px-10">
                <button
                  className="btn bg-red-600/80 hover:bg-red-600 hover:border-red-600 border-red-600 text-black dark:text-white hover:border-4 hover:cursor-pointer shadow-inner drop-shadow rounded-xl text-xl"
                  onClick={() => setIsOpen(false)}
                >
                  Cancel
                </button>
                <button className="btn bg-green-600/80 hover:bg-green-600 hover:border-green-600 border-green-600 text-black dark:text-white hover:border-4 hover:cursor-pointer shadow-inner drop-shadow rounded-xl text-xl">
                  Submit changes
                </button>
              </div>
            </div>
          </div>
        </dialog>
      )}
    </div>
  );
};

export default AllGames;
