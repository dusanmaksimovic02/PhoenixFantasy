import { type FC } from "react";
import halfCourt from "../../assets/images/halfcourt.png";
import AddedPlayerToTeamCard from "./AddedPlayerToTeamCard";
import AddedCoachCard from "./NoCoachAddedCard";
import NoAddedPlayerCard from "./NoAddedPlayerCard";

const FantasyCourt: FC = () => {
  return (
    <div className="relative w-fit border-2 rounded-2xl border-black dark:border-white">
      <img
        src={halfCourt}
        alt="basketball half court"
        className="w-150 h-125 rounded-2xl relative"
      />
      <div className="absolute top-0 left-0 w-full">
        <div>
          <div className="flex justify-center">
            <AddedPlayerToTeamCard />
          </div>
          <div className="flex px-15 justify-between w-full">
            <AddedPlayerToTeamCard />
            <NoAddedPlayerCard />
          </div>
          <div className="flex px-45 justify-between w-full">
            <NoAddedPlayerCard />
            <AddedPlayerToTeamCard />
          </div>
        </div>
        <div className="flex mt-5 border-t-2 border-black dark:border-white">
          <div className="border-r-2 border-black dark:border-white w-40">
            <AddedCoachCard />
          </div>
          <div className="flex w-full justify-between">
            <AddedPlayerToTeamCard />
            <AddedPlayerToTeamCard />
            <AddedPlayerToTeamCard />
            <AddedPlayerToTeamCard />
            <AddedPlayerToTeamCard />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FantasyCourt;
