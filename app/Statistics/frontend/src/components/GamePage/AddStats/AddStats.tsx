import { type FC } from "react";
import PlayerHeader from "./PlayerHeader";
import PointsSection from "./PointsSection";
import BlocksSection from "./BlocksSection";
import TATSSection from "./TATSSection";
import type { Player } from "../../../models/Player";
import { useQuery } from "@tanstack/react-query";
import { getPlayerStatsFromGame } from "../../../services/LiveGameService";
import Loading from "../../Loading";
import ReboundsSection from "./ReboundsSection";
import FoulsSection from "./FoulsSection";

type Props = {
  isOpenStats: boolean;
  setIsOpenStats: (isOpen: boolean) => void;
  name: string;
  surname: string;
  position: string;
  jerseyNumber: string;
  time: Date;
  gameId: string;
  selectedPlayer: Player;
  teamId: string;
};

const AddStats: FC<Props> = ({
  isOpenStats,
  setIsOpenStats,
  name,
  surname,
  position,
  jerseyNumber,
  time,
  gameId,
  selectedPlayer,
  teamId,
}) => {
  const { data: playerStats, isLoading } = useQuery({
    queryKey: ["playerStats"],
    queryFn: () => getPlayerStatsFromGame(selectedPlayer.id, gameId),
  });

  return isLoading ? (
    <Loading />
  ) : (
    <dialog open={isOpenStats} className="modal">
      <div className="modal-box flex flex-col justify-center items-center w-7/12 max-w-5xl rounded-4xl bg-surface-light dark:bg-surface-dark overflow-auto ">
        <div className="modal-action text flex flex-col gap-10 w-full shrink-0 overflow-auto">
          <button
            type="button"
            className="btn btn-sm text-red-600 btn-circle btn-ghost absolute right-2 top-2"
            onClick={() => {
              setIsOpenStats(false);
            }}
          >
            ✕
          </button>

          <div className="border rounded-4xl">
            <PlayerHeader
              setIsOpenStats={setIsOpenStats}
              name={name}
              surname={surname}
              position={position}
              jerseyNumber={jerseyNumber}
              time={time}
              playerStats={playerStats!}
            />

            <hr />

            <div className="flex">
              <PointsSection
                gameId={gameId}
                selectedPlayer={selectedPlayer}
                teamId={teamId}
                playerStats={playerStats!}
                isLoading={isLoading}
              />

              <div className="border-l" />

              <ReboundsSection
                gameId={gameId}
                selectedPlayer={selectedPlayer}
                teamId={teamId}
                playerStats={playerStats!}
                isLoading={isLoading}
              />
            </div>

            <hr />

            <div className="flex">
              <FoulsSection
                gameId={gameId}
                selectedPlayer={selectedPlayer}
                teamId={teamId}
                playerStats={playerStats!}
                isLoading={isLoading}
              />

              <div className="border-l" />

              <BlocksSection
                gameId={gameId}
                selectedPlayer={selectedPlayer}
                teamId={teamId}
                playerStats={playerStats!}
                isLoading={isLoading}
              />
            </div>

            <hr />

            <TATSSection
              gameId={gameId}
              selectedPlayer={selectedPlayer}
              teamId={teamId}
              playerStats={playerStats!}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>
    </dialog>
  );
};

export default AddStats;
