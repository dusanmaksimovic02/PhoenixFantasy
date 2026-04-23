import { useState, type FC } from "react";
import halfCourt from "../../assets/images/halfcourt.png";
import AddedPlayerToTeamCard from "./AddedPlayerToTeamCard";
// import AddedCoachCard from "./NoCoachAddedCard";
import NoAddedCoachCard from "./NoCoachAddedCard";
import NoAddedPlayerCard from "./NoAddedPlayerCard";
import { useQuery } from "@tanstack/react-query";
import { getLineup } from "../../services/FantasyTeamService";
import AddedCoachCard from "./AddedCoachCard";
import AddPlayerModal from "./AddPlayerModal";
import type { PlayerView } from "../../models/TeamLineUp";
import AddCoachModal from "./AddCoachModal";
interface FantasyCourtProps {
  teamId: string;
  draftId: string;
}

const FantasyCourt: FC<FantasyCourtProps> = ({ teamId, draftId }) => {
  const [isOpenAddPlayer, setIsOpenAddPlayer] = useState<boolean>(false);
  const [isOpenAddCoach, setIsOpenAddCoach] = useState<boolean>(false);
  const [position, setPosition] = useState<string>("");

  const { data: teamLineup } = useQuery({
    queryKey: ["teamLineup", teamId],
    queryFn: () => getLineup(teamId),
  });

  const getStartersByPos = (pos: string) => {
    return teamLineup?.starters?.filter((p: any) => p.position === pos) || [];
  };

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
              {getStartersByPos("Center").length > 0 ? (
                getStartersByPos("Center").map((p: PlayerView) => (
                  <div className="shrink-0 ">
                    <AddedPlayerToTeamCard
                      key={p.id}
                      position="C"
                      jerseyNumber={p.jerseyNumber}
                      firstName={p.firstName}
                      lastName={p.lastName}
                      fantasyPoints={""}
                    />
                  </div>
                ))
              ) : (
                <div className="shrink-0 ">
                  <NoAddedPlayerCard
                    onPlusClick={() => {
                      setPosition("Center");
                      setIsOpenAddPlayer(true);
                    }}
                  />
                </div>
              )}
            </div>
          </div>
          <div className="flex px-15 justify-between w-full">
            {[0, 1].map((index) => {
              const player = getStartersByPos("Forward")[index];
              return player ? (
                <div className="shrink-0 ">
                  <AddedPlayerToTeamCard
                    key={player.id}
                    position={"F"}
                    jerseyNumber={player.jerseyNumber}
                    firstName={player.firstName}
                    lastName={player.lastName}
                    fantasyPoints={""}
                  />
                </div>
              ) : (
                <div className="shrink-0 ">
                  <NoAddedPlayerCard
                    key={`f-${index}`}
                    onPlusClick={() => {
                      setPosition("Forward");
                      setIsOpenAddPlayer(true);
                    }}
                  />
                </div>
              );
            })}
          </div>
          <div className="flex justify-center gap-10 w-full">
            {[0, 1].map((index) => {
              const player = getStartersByPos("Guard")[index];
              return player ? (
                <div className="shrink-0 ">
                  <AddedPlayerToTeamCard
                    key={player.id}
                    position={"G"}
                    jerseyNumber={player.jerseyNumber}
                    firstName={player.firstName}
                    lastName={player.lastName}
                    fantasyPoints={""}
                  />
                </div>
              ) : (
                <div className="shrink-0 ">
                  <NoAddedPlayerCard
                    key={`f-${index}`}
                    onPlusClick={() => {
                      setPosition("Guard");
                      setIsOpenAddPlayer(true);
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div>
        <div className="flex mt-5 border-t-2 border-black dark:border-white overflow-hidden rounded-b-2xl backdrop-blur-xs h-34">
          <div className="border-r-2 border-black dark:border-white w-35 flex shrink-0 justify-center items-center">
            {teamLineup?.coach ? (
              <div className="shrink-0">
                <AddedCoachCard
                  firstName={teamLineup.coach.firstName}
                  lastName={teamLineup.coach.lastName}
                  fantasyPoints={""}
                />
              </div>
            ) : (
              <>
                <div className="shrink-0">
                  <NoAddedCoachCard
                    onPlusClick={() => {
                      setIsOpenAddCoach(true);
                    }}
                  />
                </div>
              </>
            )}
          </div>
          <div className="flex flex-1 w-full justify-start gap-3 items-center min-w-0 overflow-y-auto overflow-x-auto scroll-m-0 h-full">
            {[
              { pos: "Guard", label: "G" },
              { pos: "Guard", label: "G" },
              { pos: "Forward", label: "F" },
              { pos: "Forward", label: "F" },
              { pos: "Center", label: "C" },
            ].map((slot, index) => {
              const benchPlayersOfThisPos =
                teamLineup?.bench?.filter((p) => p.position === slot.pos) || [];

              const previousSlotsSamePos = [
                { pos: "Guard" },
                { pos: "Guard" },
                { pos: "Forward" },
                { pos: "Forward" },
                { pos: "Center" },
              ]
                .slice(0, index)
                .filter((s) => s.pos === slot.pos).length;

              const player = benchPlayersOfThisPos[previousSlotsSamePos];

              return player ? (
                <div key={player.id} className="shrink-0">
                  <AddedPlayerToTeamCard
                    position={slot.label}
                    jerseyNumber={player.jerseyNumber}
                    firstName={player.firstName}
                    lastName={player.lastName}
                    fantasyPoints={""}
                  />
                </div>
              ) : (
                <div key={`bench-slot-${index}`} className="shrink-0">
                  <NoAddedPlayerCard
                    onPlusClick={() => {
                      setPosition(slot.pos);
                      setIsOpenAddPlayer(true);
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <AddPlayerModal
        isOpen={isOpenAddPlayer}
        setIsOpen={setIsOpenAddPlayer}
        position={position}
        draftId={draftId}
        teamId={teamId}
      />
      <AddCoachModal
        isOpen={isOpenAddCoach}
        setIsOpen={setIsOpenAddCoach}
        draftId={draftId}
        teamId={teamId}
      />
    </div>
  );
};

export default FantasyCourt;
