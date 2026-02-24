import { useEffect, useState, type FC } from "react";
import Loading from "../Loading";
import { FaTrashAlt } from "react-icons/fa";
import { toast } from "react-toastify";
import z from "zod";
import type { Player } from "../../models/Player";
import {
  deletePlayer,
  getPlayers,
  updatePlayer,
} from "../../services/PlayerService";

const tableHead = ["", "Id", "Name", "Surname", "BirthDate", "JN", ""];

const formSchema = z.object({
  id: z.string(),
  firstName: z.string().min(1, "Name is required"),
  lastName: z.string().min(1, "Surname is required"),
  dateOfBirth: z.date("Birth date is required"),
  jerseyNumber: z
    .string()
    .regex(/^(0|[1-9][0-9]?|00)$/, "Jersey number must be between 00 and 99"),
});

type FormData = z.infer<typeof formSchema>;

const AllPlayers: FC = () => {
  const [isOpenDelete, setIsOpenDelete] = useState<boolean>(false);
  const [isOpenEdit, setIsOpenEdit] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedPlayerId, setSelectedPlayers] = useState<string>("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedPlayer, setSelectedPlayer] = useState<FormData>({
    id: "",
    firstName: "",
    lastName: "",
    dateOfBirth: new Date(),
    jerseyNumber: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setSelectedPlayer((c) => ({
      ...c,
      [name]: name === "dateOfBirth" ? new Date(value) : value,
    }));
  };

  const handleSave = async () => {
    const result = formSchema.safeParse(selectedPlayer);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((i) => {
        fieldErrors[i.path[0] as string] = i.message;
      });
      setErrors(fieldErrors);
      return;
    }
    try {
      await updatePlayer({
        id: selectedPlayer.id,
        firstName: selectedPlayer.firstName,
        lastName: selectedPlayer.lastName,
        dateOfBirth: selectedPlayer.dateOfBirth.toISOString().split("T")[0],
        jerseyNumber: selectedPlayer.jerseyNumber,
      });

      const updatedData = {
        id: selectedPlayer.id,
        firstName: selectedPlayer.firstName,
        lastName: selectedPlayer.lastName,
        dateOfBirth: selectedPlayer.dateOfBirth.toISOString().split("T")[0],
      };

      setPlayers((prevCoaches) =>
        prevCoaches.map((c) =>
          c.id === updatedData.id ? { ...c, ...updatedData } : c,
        ),
      );

      console.log("Player updated!");
      toast.success("Player updated successfully!");
      setErrors({});
      setSelectedPlayer({
        id: "",
        firstName: "",
        lastName: "",
        dateOfBirth: new Date(),
        jerseyNumber: "",
      });
      setIsOpenEdit(false);
      setIsLoading(false);
    } catch (err) {
      console.error(err);
    }
  };

  const formatDate = (date: Date) => {
    if (!(date instanceof Date) || isNaN(date.getTime())) return "";
    return date.toISOString().split("T")[0];
  };

  useEffect(() => {
    const fetchPlayers = async () => {
      setIsLoading(true);
      try {
        const data = await getPlayers();
        if (data) {
          setPlayers(data);
        }
      } catch (e) {
        console.log(e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPlayers();
  }, []);

  const handleDeleteClick = async () => {
    if (selectedPlayerId == "") return;

    setIsLoading(true);
    try {
      const res = await deletePlayer(selectedPlayerId);
      if (res?.status === 200) {
        toast.success("Player deleted successfully");
        setPlayers((prev) => prev.filter((c) => c.id !== selectedPlayerId));
      } else if (res?.status === 404) {
        toast.error("Player not found.");
      } else if (res?.status === 400) {
        toast.error("Cannot delete this player.");
      } else {
        toast.error("Failed to delete player. Please try again later.");
      }
    } catch (e) {
      console.log(e);
      toast.error("Failed to delete player. Please try again later.");
    } finally {
      setIsLoading(false);
      setIsOpenDelete(false);
      setSelectedPlayers("");
    }
  };

  return (
    <div className="w-full relative">
      <h3 className="text-center">All Players</h3>
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
            {players.map((player: Player) => (
              <tr
                key={player.id}
                data-tip="click to edit player"
                className="tooltip table-row border-[3px] border-surface whitespace-nowrap hover:cursor-pointer"
                onClick={() => {
                  const playerToEdit: FormData = {
                    ...player,
                    dateOfBirth: new Date(player.dateOfBirth),
                  };

                  setSelectedPlayer(playerToEdit);
                  setIsOpenEdit(true);
                }}
              >
                <td className="p-3">{player.id}</td>
                <td className="p-3 ">{player.firstName}</td>
                <td className="p-3">{player.lastName}</td>
                <td className="p-3">{player.dateOfBirth}</td>
                <td className="p-3">{player.jerseyNumber}</td>
                <td className="p-3">
                  {
                    <FaTrashAlt
                      onClick={() => {
                        setSelectedPlayers(player.id);
                        setIsOpenDelete(true);
                      }}
                      className="text-error cursor-pointer"
                    />
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <dialog open={isOpenDelete} className="modal">
          <div className="modal-box  bg-white dark:bg-custom-gray">
            <div className="modal-action text flex flex-col gap-15">
              <button
                type="button"
                className="btn btn-sm text-red-600 btn-circle btn-ghost absolute right-2 top-2"
                onClick={() => {
                  setIsOpenDelete(false);
                }}
              >
                ✕
              </button>
              <h3 className="w-full text-center">
                Are you sure you want to delete this player?
              </h3>
              <div className="flex justify-between">
                <button
                  className="btn bg-transparent hover:border-black dark:hover:border-white border-black dark:border-black text-black dark:text-white hover:border-4 hover:cursor-pointer shadow-inner drop-shadow rounded-xl text-xl"
                  onClick={() => setIsOpenDelete(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn bg-red-600/80 hover:bg-red-600 hover:border-red-600 border-red-600 text-black dark:text-white hover:border-4 hover:cursor-pointer shadow-inner drop-shadow rounded-xl text-xl"
                  onClick={handleDeleteClick}
                >
                  Delete it permanently
                </button>
              </div>
            </div>
          </div>
        </dialog>
        <dialog open={isOpenEdit} className="modal">
          <div className="modal-box  bg-white dark:bg-custom-gray">
            <div className="modal-action text flex flex-col gap-15">
              <button
                type="button"
                className="btn btn-sm text-red-600 btn-circle btn-ghost absolute right-2 top-2"
                onClick={() => {
                  setIsOpenEdit(false);
                }}
              >
                ✕
              </button>
              <h3 className="w-full text-center text-phoenix">Edit Player</h3>

              <div className="space-y-5">
                {(
                  [
                    ["firstName", "First name"],
                    ["lastName", "Last name"],
                    ["dateOfBirth", "Birth date"],
                    ["jerseyNumber", "Jersey number"],
                  ] as const
                ).map(([key, label]) => (
                  <div key={key}>
                    <label className="block mb-1 font-medium">{label}</label>
                    <input
                      name={key}
                      type={key === "dateOfBirth" ? "date" : "text"}
                      value={
                        key === "dateOfBirth"
                          ? formatDate(selectedPlayer[key] as Date)
                          : (selectedPlayer[key] as string)
                      }
                      onChange={handleChange}
                      className="
                  w-full px-4 py-3 rounded-xl
                  bg-white dark:bg-neutral-700
                  border border-neutral-300 dark:border-neutral-600
                  disabled:opacity-70
                "
                    />
                    {errors[key] && (
                      <p className="text-red-500 text-sm mt-1">{errors[key]}</p>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex justify-between px-2">
                <button
                  className="btn bg-red-600/80 hover:bg-red-600 hover:border-red-600 border-red-600 text-black dark:text-white hover:border-4 hover:cursor-pointer drop-shadow rounded-xl text-xl"
                  onClick={() => setIsOpenEdit(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn bg-green-600/80 hover:bg-green-600 hover:border-green-600 border-green-600 text-black dark:text-white hover:border-4 hover:cursor-pointer drop-shadow rounded-xl text-xl"
                  onClick={handleSave}
                >
                  Submit changes
                </button>
              </div>
            </div>
          </div>
        </dialog>
      </div>
      {isLoading && <Loading />}
    </div>
  );
};

export default AllPlayers;
