import { useQuery } from "@tanstack/react-query";
import {
  getAllFreeCoaches,
  getAllFreePlayerSorted,
  getFantasyTeamPoints,
} from "../../services/FantasyTeamService";
import { useState, type FC } from "react";
import { CiSearch } from "react-icons/ci";
import type { CoachView, PlayerView } from "../../models/TeamLineUp";
import { useFantasyPoints } from "../../context/fantasyPoints/useFantasyPoints";

interface TradePlayerPanelProps {
  leagueId: string;
  teamId: string;
  selectedFreePlayerCoach: PlayerView | CoachView | null;
  onSelectPlayer: (player: PlayerView | CoachView) => void;
}

type TradeItem =
  | (PlayerView & { isCoach: false })
  | (CoachView & {
      isCoach: true;
    });

const TradePlayerPanel: FC<TradePlayerPanelProps> = ({
  leagueId,
  onSelectPlayer,
  selectedFreePlayerCoach,
  teamId,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [activePositions, setActivePositions] = useState<string[]>([]);

  const { league } = useFantasyPoints();

  const { data: freePlayers } = useQuery({
    queryKey: ["freePlayers", leagueId],
    queryFn: () => getAllFreePlayerSorted(leagueId),
  });

  const { data: freeCoaches } = useQuery({
    queryKey: ["freeCoaches", leagueId],
    queryFn: () => getAllFreeCoaches(leagueId),
  });

  const { data: teamPoints } = useQuery({
    queryKey: ["teamPoints", teamId],
    queryFn: () => getFantasyTeamPoints(teamId, league.currentRound),
    enabled: !!league,
  });

  const combinedList = [
    ...(freePlayers || []).map((p) => ({ ...p, isCoach: false as const })),
    ...(freeCoaches?.map((coach) => ({
      ...coach,
      isCoach: true as const,
      position: "HC",
      jerseyNumber: "-",
      avgPoints: 0,
    })) || []),
  ];

  const filteredItems = combinedList.filter((item) => {
    const fullName = `${item.firstName} ${item.lastName}`.toLowerCase();
    const matchesSearch = fullName.includes(searchTerm.toLowerCase());

    const matchesPosition =
      activePositions.length > 0
        ? activePositions.includes(
            item.position === "HC" ? "HC" : item.position[0],
          )
        : true;

    return matchesSearch && matchesPosition;
  });

  const togglePosition = (pos: string) => {
    setActivePositions((prev) =>
      prev.includes(pos) ? prev.filter((p) => p !== pos) : [...prev, pos],
    );
  };

  const isInteractionDisabled = league?.isRoundActive;

  return (
    <div
      className="w-full h-[calc(100vh-140px)] flex flex-col rounded-2xl bg-neutral-100 dark:bg-neutral-800 shadow-md overflow-hidden"
      onClick={() => onSelectPlayer(null as any)}
    >
      <div className="bg-phoenix px-4 py-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-white font-bold text-lg">
              Round {league && league.currentRound}
            </h2>
            <p className="text-white/70 text-xs">
              {league && league.isRoundActive
                ? "Round in progress"
                : "Round not started"}
            </p>
          </div>
          <div className="text-right">
            <p className="text-white font-bold text-2xl">{}</p>
            <p className="text-white/70 text-xs">total pts</p>
          </div>
        </div>
      </div>

      <div className="px-4 pt-3">
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold
            ${
              league && league.isRoundActive
                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                : "bg-gray-100 text-gray-500 dark:bg-neutral-700 dark:text-neutral-400"
            }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${league && league.isRoundActive ? "bg-green-500 animate-pulse" : "bg-gray-400"}`}
          />
          {league && league.isRoundActive ? "Live" : "Inactive"}
        </span>
      </div>

      <div className="relative p-3">
        <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
          <CiSearch size={16} className="ml-2" />
        </span>
        <input
          type="text"
          placeholder="Search players..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 rounded-xl border-2 border-transparent bg-white dark:bg-neutral-700 focus:border-phoenix focus:outline-none transition-all text-sm"
        />
      </div>

      <div className="flex px-5 py-2 gap-2">
        {["G", "F", "C", "HC"].map((pos) => {
          const isActive = activePositions.includes(pos);
          return (
            <button
              key={pos}
              onClick={() => togglePosition(pos)}
              className={`text-sm border-2 px-3 py-1.5 rounded transition-all cursor-pointer ${
                isActive
                  ? "bg-phoenix border-phoenix text-white shadow-md scale-105"
                  : "bg-white dark:bg-neutral-700 border-transparent text-gray-500 hover:border-neutral-400"
              }`}
            >
              {pos}
            </button>
          );
        })}

        {activePositions.length > 0 && (
          <button
            onClick={() => setActivePositions([])}
            className="text-xs text-neutral-400 hover:text-phoenix ml-auto cursor-pointer"
          >
            Reset
          </button>
        )}
      </div>

      <div className="flex-1 min-h-0 overflow-y-scroll">
        {isInteractionDisabled && (
          <div className="bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs py-2 px-4 text-center font-medium">
            Trading is disabled while the round is live.
          </div>
        )}
        {filteredItems?.map((item: TradeItem) => (
          <div
            key={
              item.isCoach ? `coach-${item.coachId}` : `player-${item.playerId}`
            }
            className={`flex items-center justify-between border-2 rounded-xl p-3 m-2 gap-10 hover:bg-red-500 transition-transform duration-200 cursor-pointer
                ${
                  isInteractionDisabled
                    ? "cursor-not-allowed pointer-events-none opacity-60 border-transparent bg-neutral-200/50 dark:bg-neutral-700/50"
                    : "cursor-pointer hover:scale-105 hover:bg-neutral-200 shadow-sm"
                } ${
                  selectedFreePlayerCoach &&
                  (item.isCoach
                    ? "coachId" in selectedFreePlayerCoach &&
                      selectedFreePlayerCoach.coachId === item.coachId
                    : "playerId" in selectedFreePlayerCoach &&
                      selectedFreePlayerCoach.playerId === item.playerId)
                    ? "border-phoenix bg-phoenix/20 scale-105 shadow-lg"
                    : "hover:scale-105 hover:bg-neutral-200 shadow-sm"
                }`}
            onClick={(e) => {
              e.stopPropagation();

              if (isInteractionDisabled) return;

              const clickedItem = item.isCoach
                ? (item as CoachView)
                : (item as PlayerView);

              const isAlreadySelected =
                selectedFreePlayerCoach &&
                (item.isCoach
                  ? "coachId" in selectedFreePlayerCoach &&
                    selectedFreePlayerCoach.coachId === item.coachId
                  : "playerId" in selectedFreePlayerCoach &&
                    selectedFreePlayerCoach.playerId === item.playerId);

              if (isAlreadySelected) {
                onSelectPlayer(null as any);
              } else {
                onSelectPlayer(clickedItem);
              }
            }}
          >
            <div className="flex gap-1">
              <p className="text-sm border-2 m-1 p-1.5 rounded bg-surface-light dark:bg-surface-dark flex items-center">
                {item.isCoach ? "HC" : item.position[0]}
              </p>
              <div>
                <div className="gap-1 flex">
                  <p>{item.firstName} </p>
                  <p className="font-bold">{item.lastName}</p>
                </div>
                <div className="flex gap-2">
                  <p className="text-xs text-gray-400">
                    #{!item.isCoach && `${item.jerseyNumber}`}
                  </p>
                  <p className="text-xs text-gray-400">{item.teamName}</p>
                </div>
              </div>
            </div>
            <div className="border-2 rounded-md w-15 text-center p-1.5">
              {item.avgPoints.toFixed(1)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TradePlayerPanel;
