import type { User } from "@/models/User";
import { useState, type FC } from "react";
import { FaTrashAlt } from "react-icons/fa";
import { toast } from "react-toastify";

const tableHead = [
  "Id",
  "Name",
  "Surname",
  "Username",
  "Email",
  "BirthDate",
  "Phone",
  "Gender",
  "Role",
  "",
];

const AllManager: FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const referees: User[] = [
    {
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
    {
      id: "2",
      email: "referee2@gmail.com",
      password: "#Sifra123",
      name: "Referee",
      surname: "2",
      username: "referee2",
      birthDate: new Date(),
      phone: "+381646353265",
      gender: "male",
      role: "referee",
    },
    {
      id: "3",
      email: "referee3@gmail.com",
      password: "#Sifra123",
      name: "Referee",
      surname: "3",
      username: "referee3",
      birthDate: new Date(),
      phone: "+381646353265",
      gender: "male",
      role: "referee",
    },
    {
      id: "4",
      email: "referee4@gmail.com",
      password: "#Sifra123",
      name: "Referee",
      surname: "4",
      username: "referee4",
      birthDate: new Date(),
      phone: "+381646353265",
      gender: "male",
      role: "referee",
    },
    {
      id: "5",
      email: "referee5@gmail.com",
      password: "#Sifra123",
      name: "Referee",
      surname: "5",
      username: "referee5",
      birthDate: new Date(),
      phone: "+381646353265",
      gender: "male",
      role: "referee",
    },
    {
      id: "6",
      email: "referee6@gmail.com",
      password: "#Sifra123",
      name: "Referee",
      surname: "6",
      username: "referee6",
      birthDate: new Date(),
      phone: "+381646353265",
      gender: "male",
      role: "referee",
    },
    {
      id: "7",
      email: "referee7@gmail.com",
      password: "#Sifra123",
      name: "Referee",
      surname: "7",
      username: "referee7",
      birthDate: new Date(),
      phone: "+381646353265",
      gender: "male",
      role: "referee",
    },
    {
      id: "8",
      email: "referee8@gmail.com",
      password: "#Sifra123",
      name: "Referee",
      surname: "8",
      username: "referee8",
      birthDate: new Date(),
      phone: "+381646353265",
      gender: "male",
      role: "referee",
    },
    {
      id: "9",
      email: "referee9@gmail.com",
      password: "#Sifra123",
      name: "Referee",
      surname: "9",
      username: "referee9",
      birthDate: new Date(),
      phone: "+381646353265",
      gender: "male",
      role: "referee",
    },
    {
      id: "10",
      email: "referee10@gmail.com",
      password: "#Sifra123",
      name: "Referee",
      surname: "10",
      username: "referee10",
      birthDate: new Date(),
      phone: "+381646353265",
      gender: "male",
      role: "referee",
    },
  ];

  const handleDeleteClick = () => {
    toast.success("You deleted manager successfully!");
    setIsOpen(false);
  };

  return (
    <div className="w-full">
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
            {referees.map((user: User) => (
              <tr
                key={user.id}
                className="border-[3px] border-surface whitespace-nowrap"
              >
                <td className="p-3">{user.id}</td>
                <td className="p-3 ">{user.name}</td>
                <td className="p-3">{user.surname}</td>
                <td className="p-3">{user.username}</td>
                <td className="p-3">{user.email}</td>
                <td className="p-3">{user.birthDate.toString()}</td>
                <td className="p-3">{user.phone}</td>
                <td className="p-3">{user.gender}</td>
                <td className="p-3">{user.role}</td>
                <td className="p-3" onClick={() => setIsOpen(true)}>
                  {<FaTrashAlt className="text-error cursor-pointer" />}
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
    </div>
  );
};

export default AllManager;
