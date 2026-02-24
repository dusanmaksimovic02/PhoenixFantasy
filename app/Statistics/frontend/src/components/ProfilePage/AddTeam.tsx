import type { Player } from "../../models/Player";
import { useEffect, useState, type FC } from "react";
import { toast } from "react-toastify";
import { addTeam } from "../../services/TeamService";
import { IoIosArrowDown } from "react-icons/io";
import { getPlayers } from "../../services/PlayerService";
import type { Coach } from "../../models/Coach";
import { getCoaches } from "../../services/CoachService";

const AddTeam: FC = () => {
  const [team, setTeam] = useState<string>("");
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedPlayers, setSelectedPlayers] = useState<Player[]>([]);
  const [selectedCoach, setSelectedCoach] = useState<Coach>();
  const [coaches, setCoaches] = useState<Coach[]>([]);

  const handleSave = async () => {
    try {
      await addTeam(
        {
          id: "3fa85f64-5717-4562-b3fc-2c963f66afa7",
          name: team,
          coachId: selectedCoach!.id,
        },
        selectedPlayers,
      );

      console.log("Team created!");
      toast.success("Team created successfully!");
      setTeam("");
      setPlayers([]);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const players = await getPlayers();
        setPlayers(players);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchCoaches = async () => {
      try {
        const coaches = await getCoaches();
        setCoaches(coaches);
      } catch (err) {
        console.error(err);
      }
    };

    fetchCoaches();
    fetchPlayers();
  }, []);

  const togglePlayerSelection = (player: Player) => {
    setSelectedPlayers((prev) =>
      prev.find((p) => p.id === player.id)
        ? prev.filter((p) => p.id !== player.id)
        : [...prev, player],
    );
  };

  const selectCoach = (coach: Coach) => {
    setSelectedCoach(coach);
  };

  return (
    <div className="w-full max-w-2xl rounded-2xl p-8 px-14 shadow-lg bg-neutral-100 dark:bg-neutral-800">
      <h1 className="text-3xl font-bold mb-8 text-center">Add Team</h1>

      <div className="space-y-5 flex flex-col">
        <div>
          <label className="block mb-1 font-medium">Team name</label>
          <input
            type="text"
            onChange={(e) => setTeam(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 disabled:opacity-70"
          />
        </div>

        <div key={selectedCoach?.id}>
          <label className="block mb-1 font-medium">Team coach</label>
          <div className="dropdown dropdown-start w-full">
            <div
              tabIndex={0}
              role="button"
              className="flex items-center w-full justify-between px-4 py-3 rounded-xl bg-white dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 disabled:opacity-70 cursor-pointer"
            >
              Click hero to add coach to the team <IoIosArrowDown />
            </div>

            <div
              tabIndex={-1}
              className="dropdown-content menu overflow-x-auto rounded-box border border-base-content/5 bg-base-100 text-nowrap h-fit max-h-50 overflow-y-auto w-full"
            >
              <table className="table">
                <thead>
                  <tr>
                    <th>Id</th>
                    <th>Name</th>
                    <th>Surname</th>
                    <th>B</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {coaches.map((c) => (
                    <tr
                      key={c.id}
                      onClick={() => selectCoach(c)}
                      className="cursor-pointer"
                    >
                      <td>{c.id}</td>
                      <td>{c.firstName}</td>
                      <td>{c.lastName}</td>
                      <td>{c.dateOfBirth}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div>
          <label className="block mb-1 font-medium">Selected coach</label>
          <div className="p-3">
            {selectedCoach ? (
              <span className="bg-blue-100 dark:bg-blue-900 px-3 py-1 rounded-full">
                {selectedCoach.firstName} {selectedCoach.lastName}
              </span>
            ) : (
              <span>No coach selected</span>
            )}
          </div>
        </div>

        <div key={players.length}>
          <label className="block mb-1 font-medium">Team players</label>
          <div className="dropdown dropdown-start w-full">
            <div
              tabIndex={0}
              role="button"
              className="flex items-center w-full justify-between px-4 py-3 rounded-xl bg-white dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 disabled:opacity-70 cursor-pointer"
            >
              Click hero to add players to the team <IoIosArrowDown />
            </div>

            <div
              tabIndex={-1}
              className="dropdown-content menu overflow-x-auto rounded-box border border-base-content/5 bg-base-100 text-nowrap h-fit max-h-50 overflow-y-auto w-full"
            >
              <table className="table">
                <thead>
                  <tr>
                    <th>Id</th>
                    <th>Name</th>
                    <th>Surname</th>
                    <th>JN</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {players.map((p) => (
                    <tr
                      key={p.id}
                      onClick={() => togglePlayerSelection(p)}
                      className="cursor-pointer"
                    >
                      <td>{p.id}</td>
                      <td>{p.firstName}</td>
                      <td>{p.lastName}</td>
                      <td>{p.jerseyNumber}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div>
          <label className="block mb-1 font-medium">Selected players</label>
          <div className="p-3">
            {selectedPlayers.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {selectedPlayers.map((p) => (
                  <div
                    key={p.id}
                    className="bg-blue-100 dark:bg-blue-900 px-3 py-1 rounded-full"
                  >
                    {p.firstName} {p.lastName}
                  </div>
                ))}
              </div>
            ) : (
              <span>No players selected</span>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-center mt-10">
        <button
          className="px-10 py-3 rounded-xl text-white font-semibold
              bg-phoenix/60 hover:bg-phoenix/95 transition-all cursor-pointer"
          onClick={handleSave}
        >
          Add team
        </button>
      </div>
    </div>
  );
};

export default AddTeam;
