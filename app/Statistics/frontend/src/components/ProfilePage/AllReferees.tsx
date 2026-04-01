import { useState, type FC } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FaTrashAlt } from "react-icons/fa";
import { toast } from "react-toastify";
import Loading from "../Loading";
import { deleteReferee, getReferees } from "../../services/RefereeService";
import type { User } from "@/models/User";
import CustomTable from "./CustomTable";
import DeleteModal from "./DeleteModal";

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
      <CustomTable
        title={"All Referees"}
        thead={[
          "ID",
          "First Name",
          "Last Name",
          "Username",
          "Email",
          "Birth Date",
          "Phone",
          "Actions",
        ]}
        data={referees}
        renderRow={(reff: User) => (
          <>
            <td className="text-xs">{reff.id}</td>
            <td>{reff.firstName}</td>
            <td>{reff.lastName}</td>
            <td className="font-mono text-xs">{reff.userName}</td>
            <td>{reff.email}</td>
            <td>
              {reff.birthDate ? reff.birthDate.toString().split("T")[0] : "-"}
            </td>
            <td>{reff.phoneNumber}</td>
            <td className="text-center">
              <FaTrashAlt
                className="text-red-500 cursor-pointer hover:scale-120 transition-transform mx-auto"
                onClick={() => {
                  setSelectedId(reff.id);
                  setIsOpenDelete(true);
                }}
              />
            </td>
          </>
        )}
      />

      <DeleteModal
        isOpen={isOpenDelete}
        onClose={() => setIsOpenDelete(false)}
        onConfirm={() => deleteMutation.mutate(selectedId)}
        isLoading={deleteMutation.isPending}
        title="Delete Referee?"
        description="Are you sure you want to delete this referee? This action cannot be undone."
      />

      {deleteMutation.isPending && <Loading />}
    </div>
  );
};

export default AllReferees;
