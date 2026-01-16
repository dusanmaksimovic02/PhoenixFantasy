import { useReducer, type FC } from "react";
import { initialStats, statsReducer } from "../../../models/reducer";
import PlayerHeader from "./PlayerHeader";
import PointsSection from "./PointsSection";
import ReboundsSection from "./ReboundsSection";
import FoulsSection from "./FoulsSection";
import BlocksSection from "./BlocksSection";
import TATSSection from "./TATSSection";

type Props = {
  isOpenStats: boolean;
  setIsOpenStats: (isOpen: boolean) => void;
  name: string;
  surname: string;
  position: string;
  jerseyNumber: number;
  time: Date;
};

const AddStats: FC<Props> = ({
  isOpenStats,
  setIsOpenStats,
  name,
  surname,
  position,
  jerseyNumber,
  time,
}) => {
  const [stats, dispatch] = useReducer(statsReducer, initialStats);

  return (
    <dialog open={isOpenStats} className="modal">
      <div className="modal-box flex flex-col justify-center items-center w-5/12 max-w-5xl rounded-4xl bg-surface-light dark:bg-surface-dark overflow-hidden ">
        <div className="modal-action text flex flex-col gap-10 w-full">
          <button
            type="button"
            className="btn btn-sm text-red-600 btn-circle btn-ghost absolute right-2 top-2"
            onClick={() => {
              setIsOpenStats(false);
            }}
          >
            ✕
          </button>

          <div className="border  rounded-4xl">
            <PlayerHeader
              setIsOpenStats={setIsOpenStats}
              name={name}
              surname={surname}
              position={position}
              jerseyNumber={jerseyNumber}
              time={time}
            />

            <hr />

            <PointsSection stats={stats} dispatch={dispatch} />

            <hr />

            <div className="flex">
              <ReboundsSection stats={stats} dispatch={dispatch} />

              <div className="border-l" />

              <FoulsSection stats={stats} dispatch={dispatch} />
            </div>

            <hr />

            <div className="flex ">
              <BlocksSection stats={stats} dispatch={dispatch} />

              <TATSSection stats={stats} dispatch={dispatch} />
            </div>
          </div>
        </div>
      </div>
    </dialog>
  );
};

export default AddStats;
