import { type FC } from "react";
import halfCourt from "../../assets/images/halfcourt.png";
import AddedPlayerToTeamCard from "./AddedPlayerToTeamCard";
// import AddedCoachCard from "./NoCoachAddedCard";
import NoAddedCoachCard from "./NoCoachAddedCard";
import NoAddedPlayerCard from "./NoAddedPlayerCard";
import { useQuery } from "@tanstack/react-query";
import { getLineup } from "../../services/FantasyTeamService";
import AddedCoachCard from "./AddedCoachCard";
interface FantasyCourtProps {
  teamId: string;
}

const FantasyCourt: FC<FantasyCourtProps> = ({ teamId }) => {
  const { data: teamLineup } = useQuery({
    queryKey: ["teamLineup"],
    queryFn: () => getLineup(teamId),
  });

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
              {teamLineup?.starter &&
              teamLineup?.starter.length > 0 &&
              teamLineup?.starter.filter((p) => p.position == "C") ? (
                teamLineup?.starter
                  .filter((p) => p.position == "C")
                  .map((p) => <AddedPlayerToTeamCard />)
              ) : (
                <AddedPlayerToTeamCard />
              )}
            </div>
          </div>
          <div className="flex px-15 justify-between w-full">
            {teamLineup?.starter &&
            teamLineup?.starter.length > 0 &&
            teamLineup?.starter.filter((p) => p.position == "F") ? (
              teamLineup?.starter
                .filter((p) => p.position == "F")
                .map((p) => (
                  <div className="shrink-0">
                    <AddedPlayerToTeamCard />
                  </div>
                ))
            ) : (
              <>
                <div className="shrink-0">
                  <NoAddedPlayerCard />
                </div>
                <div className="shrink-0">
                  <NoAddedPlayerCard />
                </div>
              </>
            )}
          </div>
          <div className="flex justify-center gap-10 w-full">
            {teamLineup?.starter &&
            teamLineup?.starter.length > 0 &&
            teamLineup?.starter.filter((p) => p.position == "G") ? (
              teamLineup?.starter
                .filter((p) => p.position == "G")
                .map((p) => (
                  <div className="shrink-0">
                    <AddedPlayerToTeamCard />
                  </div>
                ))
            ) : (
              <>
                <div className="shrink-0">
                  <NoAddedPlayerCard />
                </div>
                <div className="shrink-0">
                  <NoAddedPlayerCard />
                </div>
              </>
            )}
          </div>
        </div>
        <div className="flex mt-5 border-t-2 border-black dark:border-white overflow-hidden rounded-b-2xl backdrop-blur-xs h-34">
          <div className="border-r-2 border-black dark:border-white w-35 flex shrink-0 justify-center items-center">
            {teamLineup?.coach ? (
              <div className="shrink-0">
                <AddedCoachCard />
              </div>
            ) : (
              <>
                <div className="shrink-0">
                  <NoAddedCoachCard />
                </div>
              </>
            )}
          </div>
          <div className="flex flex-1 w-full justify-start gap-3 items-center min-w-0 overflow-y-hidden overflow-x-auto scroll-m-0 h-full">
            <div className="shrink-0">
              {teamLineup?.bench &&
              teamLineup?.bench.length > 0 &&
              teamLineup?.bench ? (
                teamLineup?.bench.map((p) => <AddedPlayerToTeamCard />)
              ) : (
                <div className="flex flex-1 w-full justify-start gap-3 items-center min-w-0 overflow-y-hidden overflow-x-auto scroll-m-0 h-full">
                  <div className="shrink-0">
                    <NoAddedPlayerCard />
                  </div>
                  <div className="shrink-0">
                    <NoAddedPlayerCard />
                  </div>
                  <div className="shrink-0">
                    <NoAddedPlayerCard />
                  </div>
                  <div className="shrink-0">
                    <NoAddedPlayerCard />
                  </div>
                  <div className="shrink-0">
                    <NoAddedPlayerCard />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FantasyCourt;
