import type { Game } from "../../models/Game";
import { useState, type FC } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import RoasterSelection from "./RoasterSelection";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { startGame } from "../../services/LiveGameService";

interface startGameProps {}

const StartGame: FC<startGameProps> = () => {
  const queryClient = useQueryClient();
  const location = useLocation();
  const navigate = useNavigate();

  const game = location.state?.game as Game;

  const [selectedHomeIds, setSelectedHomeIds] = useState<string[]>([]);
  const [starterHomeIds, setStarterHomeIds] = useState<string[]>([]);

  const [selectedGuestIds, setSelectedGuestIds] = useState<string[]>([]);
  const [starterGuestIds, setStarterGuestIds] = useState<string[]>([]);

  const startGameMutation = useMutation({
    mutationFn: () =>
      startGame(
        game.id,
        selectedHomeIds,
        starterHomeIds,
        selectedGuestIds,
        starterGuestIds,
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teams"] });
      toast.success("Game started successfully!");

      const homeTeam = game.homeTeam.name;
      const awayTeam = game.guestTeam.name;

      navigate(`/game/${homeTeam}/vs/${awayTeam}`, {
        state: {
          game,
          selectedHomeIds,
          starterHomeIds,
          selectedGuestIds,
          starterGuestIds,
        },
      });
    },
    onError: () => toast.error("Error while starting game"),
  });

  return (
    <div className="w-screen h-fit min-h-screen pt-23 pl-10 pr-13 ">
      <div className="h-fit w-full max-sm:h-svh flex max-sm:flex-col justify-between items-center gap-5 p-7 bg-surface-light dark:bg-surface-dark rounded-4xl max-sm:justify-around flex-wrap">
        <img
          src={`${game.homeTeam.logoPathURL}`}
          alt={`${game.homeTeam} logo`}
          className="w-30 h-35"
        />

        <p className="text-3xl font-extrabold text-nowrap">
          {game.homeTeam.name}
        </p>

        <div className="flex flex-col items-center justify-center gap-1">
          <p>{game.venue}</p>
          <p>{game.dateTime?.split("T")[0] ?? ""}</p>
          <p>{game.dateTime?.split("T")[1]?.slice(0, 5) ?? ""}</p>
        </div>

        <p className="text-3xl font-extrabold text-nowrap">
          {game.guestTeam.name}
        </p>

        <img
          src={`${game.guestTeam.logoPathURL}`}
          alt="away logo"
          className="w-30 h-35"
        />
      </div>

      <div className="w-full h-fit flex gap-5 justify-between p-7">
        <div className="flex-1">
          <RoasterSelection
            teamId={game.homeTeam.id}
            selectedIds={selectedHomeIds}
            starterIds={starterHomeIds}
            setSelectedIds={setSelectedHomeIds}
            setStarterIds={setStarterHomeIds}
          />
        </div>
        <button
          disabled={
            selectedHomeIds.length < 5 ||
            selectedHomeIds.length > 12 ||
            selectedGuestIds.length < 5 ||
            selectedGuestIds.length > 12 ||
            starterHomeIds.length !== 5 ||
            starterGuestIds.length !== 5
          }
          //onClick={() => startGameMutation.mutate()}
          onClick={() => {
            const homeTeam = game.homeTeam.name;
            const awayTeam = game.guestTeam.name;

            navigate(`/game/${homeTeam}/vs/${awayTeam}`, {
              state: {
                game,
                selectedHomeIds,
                starterHomeIds,
                selectedGuestIds,
                starterGuestIds,
              },
            });
          }}
          className="btn bg-green-600/80 hover:bg-green-600 hover:border-green-600 border-green-600 text-black dark:text-white hover:border-4 hover:cursor-pointer drop-shadow rounded-xl text-xl"
        >
          Start Game
        </button>
        <div className="flex-1">
          <RoasterSelection
            teamId={game.guestTeam.id}
            selectedIds={selectedGuestIds}
            starterIds={starterGuestIds}
            setSelectedIds={setSelectedGuestIds}
            setStarterIds={setStarterGuestIds}
          />
        </div>
      </div>
    </div>
  );
};

export default StartGame;
