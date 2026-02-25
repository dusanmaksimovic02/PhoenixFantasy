import { useState, type FC } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FaTrashAlt } from "react-icons/fa";
import { toast } from "react-toastify";
import Loading from "../Loading";
import { deleteReferee, getReferees } from "../../services/RefereeService";
import type { User } from "@/models/User";

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

const AllReferees: FC = () => {
  const queryClient = useQueryClient();
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const [selectedId, setSelectedId] = useState("");

  const { data: referees = [], isLoading } = useQuery({
    queryKey: ["referees"],
    queryFn: getReferees,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteReferee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["referees"] });
      toast.success("Referee deleted successfully");
      setIsOpenDelete(false);
    },
    onError: (err) => {
      console.error(err);
      toast.error("Delete failed");
    },
  });

  if (isLoading) return <Loading />;

  return (
    <div className="w-full relative p-4">
      <h3 className="text-center text-2xl font-bold mb-6">All Referees</h3>

      <div className="overflow-x-auto rounded-xl border border-neutral-300 dark:border-neutral-700">
        <table className="table w-full bg-white dark:bg-neutral-800">
          <thead className="bg-neutral-200 dark:bg-neutral-900">
            <tr>
              {tableHead.map((head) => (
                <th key={head} className={head === "" ? "text-center" : ""}>
                  {head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {referees.map((user: User) => (
              <tr
                key={user.id}
                className="hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors text-nowrap"
              >
                <td className="text-xs">{user.id}</td>
                <td>{user.firstName}</td>
                <td>{user.lastName}</td>
                <td className="font-mono text-xs">{user.userName}</td>
                <td>{user.email}</td>
                <td>
                  {user.birthDate
                    ? user.birthDate.toString().split("T")[0]
                    : "-"}
                </td>
                <td>{user.phoneNumber}</td>
                <td>
                  <span className="badge badge-outline">{user.role}</span>
                </td>
                <td className="text-center">
                  <FaTrashAlt
                    className="text-red-500 cursor-pointer hover:scale-120 transition-transform mx-auto"
                    onClick={() => {
                      setSelectedId(user.id);
                      setIsOpenDelete(true);
                    }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <dialog open={isOpenDelete} className="modal">
        <div className="modal-box bg-white dark:bg-neutral-800">
          <h3 className="font-bold text-lg text-center">Delete Referee?</h3>
          <p className="py-4 text-center">
            Are you sure you want to delete this referee? This action cannot be
            undone.
          </p>
          <div className="modal-action flex justify-around">
            <button
              className="btn btn-outline"
              onClick={() => setIsOpenDelete(false)}
            >
              Cancel
            </button>
            <button
              className="btn btn-error text-white"
              onClick={() => deleteMutation.mutate(selectedId)}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete Permanently"}
            </button>
          </div>
        </div>
      </dialog>

      {deleteMutation.isPending && <Loading />}
    </div>
  );
};

export default AllReferees;
