import type { User } from "../../models/User";
import { deleteManager, getMangers } from "../../services/api";
import { useEffect, useState, type FC } from "react";
import { FaTrashAlt } from "react-icons/fa";
import { toast } from "react-toastify";
import Loading from "../Loading";

const tableHead = [
  "Id",
  "Name",
  "Surname",
  "Username",
  "Email",
  "BirthDate",
  "Phone",
  "Role",
  "",
];

const AllManager: FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [managers, setManagers] = useState<User[]>([]);
  const [selectedManagerId, setSelectedManagerId] = useState<string>("");

  useEffect(() => {
    const fetchManagers = async () => {
      setIsLoading(true);
      try {
        const res = await getMangers();
        if (res?.data) {
          setManagers(res.data);
        }
      } catch (e) {
        console.log(e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchManagers();
  }, []);

  const handleDeleteClick = async () => {
    if (selectedManagerId == "") return;

    setIsLoading(true);
    try {
      const res = await deleteManager(selectedManagerId);
      if (res?.status === 200) {
        toast.success("Manager deleted successfully");
        setManagers((prev) => prev.filter((m) => m.id !== selectedManagerId));
      } else if (res?.status === 404) {
        toast.error("Manager not found.");
      } else if (res?.status === 400) {
        toast.error("Cannot delete this manager.");
      } else {
        toast.error("Failed to delete manager. Please try again later.");
      }
    } catch (e) {
      console.log(e);
      toast.error("Failed to delete manager. Please try again later.");
    } finally {
      setIsLoading(false);
      setIsOpen(false);
      setSelectedManagerId("");
    }
  };

  return (
    <div className="w-full relative">
      <h3 className="text-center">All Managers</h3>
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
            {managers.map((user: User) => (
              <tr
                key={user.id}
                className="border-[3px] border-surface whitespace-nowrap"
              >
                <td className="p-3">{user.id}</td>
                <td className="p-3 ">{user.firstName}</td>
                <td className="p-3">{user.lastName}</td>
                <td className="p-3">{user.userName}</td>
                <td className="p-3">{user.email}</td>
                <td className="p-3">{""}</td>
                <td className="p-3">{user.phoneNumber}</td>
                <td className="p-3">{user.role}</td>
                <td className="p-3">
                  {
                    <FaTrashAlt
                      onClick={() => {
                        setSelectedManagerId(user.id);
                        setIsOpen(true);
                      }}
                      className="text-error cursor-pointer"
                    />
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <dialog open={isOpen} className="modal">
          <div className="modal-box  bg-white dark:bg-custom-gray">
            <div className="modal-action text flex flex-col gap-15">
              <button
                type="button"
                className="btn btn-sm text-red-600 btn-circle btn-ghost absolute right-2 top-2"
                onClick={() => {
                  setIsOpen(false);
                }}
              >
                ✕
              </button>
              <h3 className="w-full text-center">
                Are you sure you want to delete this manager?
              </h3>
              <div className="flex justify-between">
                <button
                  className="btn bg-transparent hover:border-black dark:hover:border-white border-black dark:border-black text-black dark:text-white hover:border-4 hover:cursor-pointer shadow-inner drop-shadow rounded-xl text-xl"
                  onClick={() => setIsOpen(false)}
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
      </div>
      {isLoading && <Loading />}
    </div>
  );
};

export default AllManager;
