import { useState, type FC } from "react";
import halfCourt from "../../assets/images/halfcourt.png";
import DraftLeaguePlayerCard from "./DraftLeaguePlayerCard";
import DraftLeagueCoachCard from "./DraftLeagueCoachCard";

interface Player {
  id: string;
  position: string;
  jerseyNumber: string;
  firstName: string;
  lastName: string;
  fantasyPoints: string;
}

interface DraftLeagueCourtProps {
  teamName: string;
  captainId: string | null;
  onCaptainToggle: (playerId: string) => void;
}

// mock starters
const MOCK_STARTERS: Player[] = [
  { id: "1", position: "Center", jerseyNumber: "10", firstName: "Nikola", lastName: "Jokic", fantasyPoints: "24.5" },
  { id: "2", position: "Forward", jerseyNumber: "23", firstName: "LeBron", lastName: "James", fantasyPoints: "18.0" },
  { id: "3", position: "Forward", jerseyNumber: "34", firstName: "Giannis", lastName: "Antetokounmpo", fantasyPoints: "21.0" },
  { id: "4", position: "Guard", jerseyNumber: "30", firstName: "Stephen", lastName: "Curry", fantasyPoints: "15.5" },
  { id: "5", position: "Guard", jerseyNumber: "11", firstName: "Kyrie", lastName: "Irving", fantasyPoints: "12.0" },
];

// mock bench
const MOCK_BENCH: Player[] = [
  { id: "6", position: "Guard", jerseyNumber: "3", firstName: "Chris", lastName: "Paul", fantasyPoints: "8.0" },
  { id: "7", position: "Guard", jerseyNumber: "7", firstName: "Kevin", lastName: "Durant", fantasyPoints: "6.5" },
  { id: "8", position: "Forward", jerseyNumber: "9", firstName: "Kawhi", lastName: "Leonard", fantasyPoints: "5.0" },
  { id: "9", position: "Forward", jerseyNumber: "2", firstName: "Jayson", lastName: "Tatum", fantasyPoints: "7.0" },
  { id: "10", position: "Center", jerseyNumber: "15", firstName: "Joel", lastName: "Embiid", fantasyPoints: "9.5" },
];

// mock coach
const MOCK_COACH = {
  firstName: "Gregg",
  lastName: "Popovich",
  fantasyPoints: "5.0",
};

const DraftLeagueCourt: FC<DraftLeagueCourtProps> = ({
  teamName,
  captainId,
  onCaptainToggle,
}) => {
  const getStartersByPos = (pos: string) =>
    MOCK_STARTERS.filter((p) => p.position === pos);

  return (
    <div className="flex flex-col items-center gap-2">
      <h1 className="text-3xl font-bold">{teamName}</h1>

      <div className="relative w-fit border-2 rounded-2xl border-black dark:border-white">
        <img
          src={halfCourt}
          alt="basketball half court"
          className="w-150 h-129 rounded-2xl relative"
        />

        <div className="absolute top-0 left-0 w-full h-full">
          {/* starters */}
          <div>
            {/* center */}
            <div className="flex justify-center">
              {getStartersByPos("Center").map((p) => (
                <div key={p.id} className="shrink-0">
                  <DraftLeaguePlayerCard
                    position="C"
                    jerseyNumber={p.jerseyNumber}
                    firstName={p.firstName}
                    lastName={p.lastName}
                    fantasyPoints={p.fantasyPoints}
                    isCaptain={captainId === p.id}
                    onCaptainToggle={() => onCaptainToggle(p.id)}
                  />
                </div>
              ))}
            </div>

            {/* forwards */}
            <div className="flex px-15 justify-between w-full">
              {[0, 1].map((index) => {
                const player = getStartersByPos("Forward")[index];
                return player ? (
                  <div key={player.id} className="shrink-0">
                    <DraftLeaguePlayerCard
                      position="F"
                      jerseyNumber={player.jerseyNumber}
                      firstName={player.firstName}
                      lastName={player.lastName}
                      fantasyPoints={player.fantasyPoints}
                      isCaptain={captainId === player.id}
                      onCaptainToggle={() => onCaptainToggle(player.id)}
                    />
                  </div>
                ) : (
                  <div key={`f-empty-${index}`} className="w-20 h-30 opacity-30 bg-white/20 rounded-xl" />
                );
              })}
            </div>

            {/* guards */}
            <div className="flex justify-center gap-10 w-full">
              {[0, 1].map((index) => {
                const player = getStartersByPos("Guard")[index];
                return player ? (
                  <div key={player.id} className="shrink-0">
                    <DraftLeaguePlayerCard
                      position="G"
                      jerseyNumber={player.jerseyNumber}
                      firstName={player.firstName}
                      lastName={player.lastName}
                      fantasyPoints={player.fantasyPoints}
                      isCaptain={captainId === player.id}
                      onCaptainToggle={() => onCaptainToggle(player.id)}
                    />
                  </div>
                ) : (
                  <div key={`g-empty-${index}`} className="w-20 h-30 opacity-30 bg-white/20 rounded-xl" />
                );
              })}
            </div>
          </div>

          {/* bench */}
          <div className="flex mt-5 border-t-2 border-black dark:border-white overflow-hidden rounded-b-2xl backdrop-blur-xs h-34">
            {/* coach */}
            <div className="border-r-2 border-black dark:border-white w-35 flex shrink-0 justify-center items-center">
              <DraftLeagueCoachCard
                firstName={MOCK_COACH.firstName}
                lastName={MOCK_COACH.lastName}
                fantasyPoints={MOCK_COACH.fantasyPoints}
              />
            </div>

           
            <div className="flex flex-1 w-full justify-start gap-3 items-center min-w-0 overflow-x-auto h-full px-2">
              {[
                { pos: "Guard", label: "G" },
                { pos: "Guard", label: "G" },
                { pos: "Forward", label: "F" },
                { pos: "Forward", label: "F" },
                { pos: "Center", label: "C" },
              ].map((slot, index) => {
                const benchOfPos = MOCK_BENCH.filter((p) => p.position === slot.pos);
                const prevSamePos = [
                  { pos: "Guard" }, { pos: "Guard" },
                  { pos: "Forward" }, { pos: "Forward" },
                  { pos: "Center" },
                ].slice(0, index).filter((s) => s.pos === slot.pos).length;

                const player = benchOfPos[prevSamePos];

                return player ? (
                  <div key={player.id} className="shrink-0">
                    <DraftLeaguePlayerCard
                      position={slot.label}
                      jerseyNumber={player.jerseyNumber}
                      firstName={player.firstName}
                      lastName={player.lastName}
                      fantasyPoints={player.fantasyPoints}
                      isCaptain={captainId === player.id}
                      onCaptainToggle={() => onCaptainToggle(player.id)}
                    />
                  </div>
                ) : (
                  <div key={`bench-empty-${index}`} className="w-20 h-25 shrink-0 opacity-30 bg-white/20 rounded-xl" />
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DraftLeagueCourt;