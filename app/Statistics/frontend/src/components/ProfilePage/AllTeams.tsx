import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteTeam,
  getTeams,
  removeCoachFromTeam,
} from "../../services/TeamService";
import { useState, type FC } from "react";
import Loading from "../Loading";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import EditTeamCoachModal from "./EditTeamCoachModal";
import EditPlayersModal from "./EditPlayersModal";
import LogoUpload from "./UploadLogo";
import CustomTable from "./CustomTable";
import type { Team } from "@/models/Team";
import { toast } from "react-toastify";
import DeleteModal from "./DeleteModal";

const AllTeams: FC = () => {
  const queryClient = useQueryClient();
  const [isOpenCoach, setIsOpenCoach] = useState(false);
  const [isOpenPlayers, setIsOpenPlayers] = useState(false);
  const [selectedTeamId, setSelectedTeamId] = useState<string>("");
  const [isOpenDeleteTeam, setIsOpenDeleteTeam] = useState<boolean>(false);
  const [isOpenRemoveCoach, setIsOpenRemoveCoach] = useState<boolean>(false);
  const [logoUpdateKey, setLogoUpdateKey] = useState<number>(Date.now());

  const { data: teams = [], isLoading } = useQuery({
    queryKey: ["teams"],
    queryFn: getTeams,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteTeam(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teams"] });
      toast.success("Team deleted successfully");
      setIsOpenDeleteTeam(false);
    },
    onError: () => toast.error("Delete failed"),
  });

  const removeCoachMutation = useMutation({
    mutationFn: (id: string) => removeCoachFromTeam(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teams"] });
      queryClient.invalidateQueries({ queryKey: ["freeCoaches"] });
      toast.success("Coach removed from team successfully");
      setIsOpenRemoveCoach(false);
    },
    onError: () => toast.error("Delete failed"),
  });

  if (isLoading) return <Loading />;

  return (
    <div className="w-full">
      <CustomTable
        title={"All Teams"}
        thead={["ID", "Logo", "Name", "Coach", "Players", "Actions"]}
        data={teams}
        renderRow={(team: Team) => (
          <>
            <td>{team.id}</td>
            <td className="flex items-center justify-between gap-2">
              <div className="w-15 h-25 overflow-hidden text-wrap">
                <img
                  src={`${team.logoPathURL}?t=${logoUpdateKey}`}
                  alt={team.name}
                />
              </div>
              <LogoUpload
                teamId={team.id}
                onUploadSuccess={() => setLogoUpdateKey(Date.now())}
              />
            </td>
            <td>{team.name}</td>
            <td>
              <div className="h-full flex gap-2 items-center justify-center">
                <span>
                  {team.coach ? team.coach.firstName : "No coach"}{" "}
                  {team.coach ? team.coach.lastName : ""}{" "}
                </span>
                <FaEdit
                  className="text-blue-500 cursor-pointer hover:scale-120 transition-transform"
                  onClick={() => {
                    setIsOpenCoach(true);
                    setSelectedTeamId(team.id);
                  }}
                />

                {team.coach && (
                  <FaTrashAlt
                    className="text-red-500 cursor-pointer hover:scale-120 transition-transform"
                    onClick={() => {
                      setSelectedTeamId(team.id);
                      setIsOpenRemoveCoach(true);
                    }}
                  />
                )}
              </div>
            </td>
            <td>
              <div className="h-full flex gap-2 items-center justify-center">
                <span>Edit players</span>
                <FaEdit
                  className="text-blue-500 cursor-pointer hover:scale-120 transition-transform"
                  onClick={() => {
                    setIsOpenPlayers(true);
                    setSelectedTeamId(team.id);
                  }}
                />
              </div>
            </td>
            <td>
              <div className="h-full flex gap-2 items-center justify-center">
                <FaTrashAlt
                  className="text-red-500 cursor-pointer hover:scale-120 transition-transform"
                  onClick={() => {
                    setSelectedTeamId(team.id);
                    setIsOpenDeleteTeam(true);
                  }}
                />
              </div>
            </td>
          </>
        )}
      />

      <EditTeamCoachModal
        teamId={selectedTeamId}
        setIsOpen={() => setIsOpenCoach(false)}
        isOpen={isOpenCoach}
      />

      <EditPlayersModal
        teamId={selectedTeamId}
        setIsOpen={() => setIsOpenPlayers(false)}
        isOpen={isOpenPlayers}
      />

      <DeleteModal
        isOpen={isOpenDeleteTeam}
        onClose={() => setIsOpenDeleteTeam(false)}
        onConfirm={() => {
          deleteMutation.mutate(selectedTeamId);
        }}
        isLoading={deleteMutation.isPending}
        title="Delete Team?"
        description="Are you sure you want to delete this team? This action cannot be undone."
      />

      <DeleteModal
        isOpen={isOpenRemoveCoach}
        onClose={() => setIsOpenRemoveCoach(false)}
        onConfirm={() => {
          removeCoachMutation.mutate(selectedTeamId);
        }}
        isLoading={removeCoachMutation.isPending}
        title="Remove Coach?"
        description="Are you sure you want to remove the coach from the team? This action cannot be undone."
      />
    </div>
  );
};

export default AllTeams;
