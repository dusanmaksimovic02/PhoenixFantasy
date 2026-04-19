import { type FC } from "react";
import halfCourt from "../../assets/images/halfcourt.png";
import AddedPlayerToTeamCard from "./AddedPlayerToTeamCard";
// import AddedCoachCard from "./NoCoachAddedCard";
import NoAddedCoachCard from "./NoCoachAddedCard";
import NoAddedPlayerCard from "./NoAddedPlayerCard";

const FantasyCourt: FC = () => {
  return (
    <div className="relative w-fit border-2 rounded-2xl border-black dark:border-white">
      <img
        src={halfCourt}
        alt="basketball half court"
        className="w-150 h-129 rounded-2xl relative"
      />
      <div className="absolute top-0 left-0 w-full h-full">
        <div>
          <div className="flex justify-center">
            <div className="shrink-0">
              <AddedPlayerToTeamCard />
            </div>
          </div>
          <div className="flex px-15 justify-between w-full">
            <div className="shrink-0">
              <AddedPlayerToTeamCard />
            </div>
            <div className="shrink-0">
              <NoAddedPlayerCard />
            </div>
          </div>
          <div className="flex justify-center gap-10 w-full">
            <div className="shrink-0">
              <NoAddedPlayerCard />
            </div>
            <div className="shrink-0">
              <AddedPlayerToTeamCard />
            </div>
          </div>
        </div>
        <div className="flex mt-5 border-t-2 border-black dark:border-white overflow-hidden rounded-b-2xl backdrop-blur-xs h-34">
          <div className="border-r-2 border-black dark:border-white w-35 flex shrink-0 justify-center items-center">
            <NoAddedCoachCard />
          </div>
          <div className="flex flex-1 w-full justify-start gap-3 items-center min-w-0 overflow-y-hidden overflow-x-auto scroll-m-0 h-full">
            <div className="shrink-0">
              <AddedPlayerToTeamCard />
            </div>
            <div className="shrink-0">
              <AddedPlayerToTeamCard />
            </div>
            <div className="shrink-0">
              <AddedPlayerToTeamCard />
            </div>
            <div className="shrink-0">
              <AddedPlayerToTeamCard />
            </div>
            <div className="shrink-0">
              <AddedPlayerToTeamCard />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FantasyCourt;
