import { useState, type FC } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FaTrashAlt } from "react-icons/fa";
import { toast } from "react-toastify";
import Loading from "../Loading";
import { deleteManager, getMangers } from "../../services/ManagerService";
import type { User } from "../../models/User";

const AllManager: FC = () => {
  const queryClient = useQueryClient();
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const [selectedId, setSelectedId] = useState("");

  const { data: managers = [], isLoading } = useQuery({
    queryKey: ["managers"],
    queryFn: getMangers,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteManager,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["managers"] });
      toast.success("Manager deleted successfully");
      setIsOpenDelete(false);
    },
    onError: () => toast.error("Delete failed"),
  });

  if (isLoading) return <Loading />;

  return (
    <div className="w-full relative p-4">
      <h3 className="text-center text-2xl font-bold mb-6">All Managers</h3>

      <div className="overflow-x-auto rounded-xl border border-neutral-300 dark:border-neutral-700">
        <table className="table w-full bg-white dark:bg-neutral-800">
          <thead className="bg-neutral-200 dark:bg-neutral-900">
            <tr>
              <th>ID</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {managers.map((manager: User) => (
              <tr
                key={manager.id}
                className="hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors text-nowrap"
              >
                <td className="text-xs">{manager.id}</td>
                <td>{manager.firstName}</td>
                <td>{manager.lastName}</td>
                <td>{manager.email}</td>
                <td>{manager.phoneNumber}</td>
                <td>
                  <div className="flex justify-center gap-4">
                    <FaTrashAlt
                      className="text-red-500 cursor-pointer hover:scale-120 transition-transform"
                      onClick={() => {
                        setSelectedId(manager.id);
                        setIsOpenDelete(true);
                      }}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <dialog open={isOpenDelete} className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg text-center">Delete Manager?</h3>
          <p className="py-4 text-center">This action cannot be undone.</p>
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
    </div>
  );
};

export default AllManager;
