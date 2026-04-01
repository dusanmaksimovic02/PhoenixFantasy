import { useState, type FC } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FaTrashAlt, FaEdit } from "react-icons/fa";
import { toast } from "react-toastify";
import Loading from "../Loading";
import { deleteCoach, getCoaches } from "../../services/CoachService";
import type { Coach } from "../../models/Coach";
import CustomTable from "./CustomTable";
import DeleteModal from "./DeleteModal";
import EditCoachModal from "./EditCoachModal";

const AllCoach: FC = () => {
  const queryClient = useQueryClient();
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const [isOpenEdit, setIsOpenEdit] = useState(false);
  const [selectedCoach, setSelectedCoach] = useState<Coach>();

  const { data: coaches = [], isLoading } = useQuery({
    queryKey: ["coaches"],
    queryFn: getCoaches,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCoach,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coaches"] });
      toast.success("Coach deleted successfully");
      setIsOpenDelete(false);
    },
    onError: () => toast.error("Delete failed"),
  });

  if (isLoading) return <Loading />;

  return (
    <div className="w-full relative p-4">
      <CustomTable
        title={"All Coaches"}
        thead={["ID", "First Name", "Last Name", "Birth Date", "Actions"]}
        data={coaches}
        renderRow={(coach: Coach) => (
          <>
            <td className="text-xs">{coach.id}</td>
            <td>{coach.firstName}</td>
            <td>{coach.lastName}</td>
            <td>{coach.dateOfBirth.split("T")[0]}</td>
            <td>
              <div className="flex justify-center gap-4">
                <FaEdit
                  className="text-blue-500 cursor-pointer hover:scale-120 transition-transform"
                  onClick={() => {
                    setIsOpenEdit(true);
                    setSelectedCoach(coach);
                  }}
                />
                <FaTrashAlt
                  className="text-red-500 cursor-pointer hover:scale-120 transition-transform"
                  onClick={() => {
                    setSelectedCoach(coach);
                    setIsOpenDelete(true);
                  }}
                />
              </div>
            </td>
          </>
        )}
      />

      <DeleteModal
        isOpen={isOpenDelete}
        onClose={() => setIsOpenDelete(false)}
        onConfirm={() => deleteMutation.mutate(selectedCoach!.id)}
        isLoading={deleteMutation.isPending}
        title="Delete Coach?"
        description="Are you sure you want to delete this coach? This action cannot be undone."
      />

      <EditCoachModal
        isOpen={isOpenEdit}
        setIsOpen={setIsOpenEdit}
        coach={selectedCoach!}
      />
    </div>
  );
};

export default AllCoach;
