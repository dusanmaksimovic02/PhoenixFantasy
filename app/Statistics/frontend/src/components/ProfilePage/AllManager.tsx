import { useState, type FC } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FaTrashAlt } from "react-icons/fa";
import { toast } from "react-toastify";
import Loading from "../Loading";
import { deleteManager, getMangers } from "../../services/ManagerService";
import type { User } from "../../models/User";
import CustomTable from "./CustomTable";
import DeleteModal from "./DeleteModal";

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
      <CustomTable
        title={"All Managers"}
        thead={["ID", "First Name", "Last Name", "Email", "Phone", "Actions"]}
        data={managers}
        renderRow={(manager: User) => {
          return (
            <>
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
            </>
          );
        }}
      />

      <DeleteModal
        isOpen={isOpenDelete}
        onClose={() => setIsOpenDelete(false)}
        onConfirm={() => deleteMutation.mutate(selectedId)}
        isLoading={deleteMutation.isPending}
        title="Delete Manager?"
        description="Are you sure you want to delete this manager? This action cannot be undone."
      />
    </div>
  );
};

export default AllManager;
