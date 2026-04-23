import { useMutation } from "@tanstack/react-query";
import { useDraft } from "../../context/draft/useDraft";
import { useEffect, useState, type FC } from "react";
import { pickCoach } from "../../services/CreateDraftLeagueService";
import { toast } from "react-toastify";
import type { CoachView } from "@/models/TeamLineUp";
import coach from "../../assets/images/coach.png";

interface AddCoachModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  draftId: string;
  teamId: string;
}

const AddCoachModal: FC<AddCoachModalProps> = ({
  isOpen,
  setIsOpen,
  teamId,
  draftId,
}) => {
  const { availableCoaches, isMyTurn } = useDraft();
  const [searchTerm, setSearchTerm] = useState<string>("");

  const addCoachMutation = useMutation({
    mutationFn: (playerId: string) => pickCoach(draftId, teamId, playerId),
    onSuccess: () => {
      toast.success("Coach picked successfully!");
      setSearchTerm("");
      setIsOpen(false);
    },
    onError: (err) => {
      console.log(err);
      toast.error("Error while picking player");
    },
  });

  useEffect(() => {
    if (isOpen && !isMyTurn) {
      setIsOpen(false);
      setSearchTerm("");
    }
  }, [isMyTurn, isOpen, setIsOpen]);

  const filteredCoaches: CoachView[] = availableCoaches.filter(
    (c: CoachView) => {
      const matchesSearch = (c.firstName + " " + c.lastName)
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      return matchesSearch;
    },
  );
  return (
    <dialog open={isOpen} className="modal">
      <div className="modal-box bg-gray-200 dark:bg-neutral-800">
        <button
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 bg-white hover:text-black dark:bg-neutral-800 dark:hover:text-white dark:hover:border-white"
          onClick={() => setIsOpen(false)}
        >
          ✕
        </button>
        <h3 className="text-phoenix text-center">Select Coach to add</h3>

        <div className="mb-6">
          <input
            type="text"
            placeholder="Search player by name..."
            className="input input-bordered w-full bg-white dark:bg-neutral-700 text-black dark:text-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex gap-4 overflow-y-auto max-h-96 flex-wrap justify-center p-2">
          {filteredCoaches.length > 0 ? (
            filteredCoaches.map((c: CoachView) => (
              <div
                key={c.id}
                className={`relative w-25 h-30 shrink-0 cursor-pointer transition-transform hover:scale-105 ${
                  addCoachMutation.isPending
                    ? "opacity-50 pointer-events-none"
                    : ""
                }`}
                onClick={() => addCoachMutation.mutate(c.id)}
              >
                <img
                  src={coach}
                  alt="jersey"
                  className="w-25 h-30 rounded-2xl"
                />
                <div className="absolute inset-0 w-full h-full text-black flex flex-col justify-center items-center pt-2">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/sr/thumb/8/80/KK_Partizan_logo.svg/1920px-KK_Partizan_logo.svg.png"
                    alt="club logo"
                    className="w-4 h-4"
                  />

                  <p className="text-[13px] font-bold text-center">
                    {c.firstName.charAt(0)}. {c.lastName}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center py-10 opacity-50">No coaches found.</p>
          )}
        </div>
      </div>
    </dialog>
  );
};

export default AddCoachModal;
