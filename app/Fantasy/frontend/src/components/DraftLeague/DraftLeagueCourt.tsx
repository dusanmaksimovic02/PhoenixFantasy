import { useState, type FC } from "react";
import halfCourt from "../../assets/images/halfcourt.png";
import DraftLeaguePlayerCard from "./DraftLeaguePlayerCard";
import DraftLeagueCoachCard from "./DraftLeagueCoachCard";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  changCaptain,
  getLineup,
  getPointsForTeam,
  switchPlayer,
  tradeCoach,
  tradePlayer,
} from "../../services/FantasyTeamService";
import { toast } from "react-toastify";
import type { CoachView, PlayerView } from "../../models/TeamLineUp";
import { useFantasyPoints } from "../../context/fantasyPoints/useFantasyPoints";

interface DraftLeagueCourtProps {
  teamName: string;
  teamId: string;
  selectedFreePlayerCoach: PlayerView | CoachView | null;
  leagueId: string;
}

const DraftLeagueCourt: FC<DraftLeagueCourtProps> = ({
  teamName,
  teamId,
  selectedFreePlayerCoach,
  leagueId,
}) => {
  const { league } = useFantasyPoints();

  const [selectedTeamPlayer, setSelectedTeamPlayer] =
    useState<PlayerView | null>(null);

  const { data: teamLineup } = useQuery({
    queryKey: ["teamLineup", teamId],
    queryFn: () => getLineup(teamId),
  });

  const { data: teamPoints } = useQuery({
    queryKey: ["teamPoints", teamId],
    queryFn: () => getPointsForTeam(teamId),
  });
  const queryClient = useQueryClient();

  const changeCaptainMutation = useMutation({
    mutationFn: (data: { fantasyTeamId: string; newCaptainPlayerId: string }) =>
      changCaptain(data.fantasyTeamId, data.newCaptainPlayerId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teamLineup", teamId] });
      queryClient.invalidateQueries({ queryKey: ["freePlayers", leagueId] });
      toast.success("Captain changed successfully");
    },
    onError: (error) => {
      console.error("Error changing captain:", error);
      toast.error("Failed to change captain");
    },
  });

  const tradeCoachMutation = useMutation({
    mutationFn: (data: {
      fantasyTeamId: string;
      oldCoachId: string;
      newCoachId: string;
    }) => tradeCoach(data.fantasyTeamId, data.oldCoachId, data.newCoachId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teamLineup", teamId] });
      queryClient.invalidateQueries({ queryKey: ["freeCoaches", leagueId] });
      toast.success("Coach traded successfully");
    },
    onError: () => toast.error("Failed to trade coach"),
  });

  const tradeMutation = useMutation({
    mutationFn: (data: {
      fantasyTeamId: string;
      oldPlayerId: string;
      newPlayerId: string;
      newPlayerPosition: string;
    }) =>
      tradePlayer(
        data.fantasyTeamId,
        data.oldPlayerId,
        data.newPlayerId,
        data.newPlayerPosition,
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teamLineup", teamId] });
      queryClient.invalidateQueries({ queryKey: ["freePlayers", leagueId] });
      toast.success("Player traded successfully");
    },
    onError: (error) => {
      console.error("Error trading player:", error);
      toast.error("Failed to trade player");
    },
  });

  const handlePlayerClick = (myPlayer: PlayerView) => {
    if (selectedFreePlayerCoach as PlayerView) {
      if (
        (selectedFreePlayerCoach as PlayerView).position !== myPlayer.position
      ) {
        toast.error("You can only swap players of the same position!");
        return;
      }

      tradeMutation.mutate({
        fantasyTeamId: teamId,
        oldPlayerId: myPlayer.playerId,
        newPlayerId: (selectedFreePlayerCoach as PlayerView).playerId,
        newPlayerPosition: (selectedFreePlayerCoach as PlayerView).position,
      });
    } else {
      toast.info("Select a free player to swap with!");
    }
  };

  const handleCoachClick = (myCoach: CoachView) => {
    if (isRoundActive) return;

    if (selectedFreePlayerCoach) {
      const isCoachSelected =
        !("position" in selectedFreePlayerCoach) ||
        (selectedFreePlayerCoach as any).position === "HC";

      if (!isCoachSelected) {
        toast.error("You can only swap a coach with another coach!");
        return;
      }

      tradeCoachMutation.mutate({
        fantasyTeamId: teamId,
        oldCoachId: myCoach.coachId,
        newCoachId: (selectedFreePlayerCoach as CoachView).coachId,
      });
    }
  };

  const isTarget = (position: string) => {
    return (
      selectedFreePlayerCoach &&
      (selectedFreePlayerCoach as PlayerView).position === position
    );
  };

  const triggerSwap = (clickedPlayer: PlayerView) => {
    if (isRoundActive) {
      toast.warning("Team management is disabled during the round!");
      return;
    }
    if (selectedFreePlayerCoach && !("coachId" in selectedFreePlayerCoach)) {
      handlePlayerClick(clickedPlayer);
      return;
    }

    if (selectedTeamPlayer) {
      if (selectedTeamPlayer.playerId === clickedPlayer.playerId) {
        setSelectedTeamPlayer(null);
        return;
      }

      const isSelectedInStarters = teamLineup?.starters.some(
        (p) => p.playerId === selectedTeamPlayer.playerId,
      );
      const isClickedInStarters = teamLineup?.starters.some(
        (p) => p.playerId === clickedPlayer.playerId,
      );

      if (isSelectedInStarters === isClickedInStarters) {
        setSelectedTeamPlayer(clickedPlayer);
        toast.info(`Selected ${clickedPlayer.lastName} for swap.`);
        return;
      }

      if (selectedTeamPlayer.position !== clickedPlayer.position) {
        toast.error("You can only switch players of the same position!");
        setSelectedTeamPlayer(null);
        return;
      }

      if (selectedTeamPlayer.position !== clickedPlayer.position) {
        toast.error("You can only switch players of the same position!");
        setSelectedTeamPlayer(null);
        return;
      }

      switchPlayerMutation.mutate({
        fantasyTeamId: teamId,
        starterPlayerId: teamLineup?.starters.some(
          (p) => p.playerId === clickedPlayer.playerId,
        )
          ? clickedPlayer.playerId
          : selectedTeamPlayer.playerId,
        benchPlayerId: teamLineup?.starters.some(
          (p) => p.playerId === clickedPlayer.playerId,
        )
          ? selectedTeamPlayer.playerId
          : clickedPlayer.playerId,
      });
    } else {
      setSelectedTeamPlayer(clickedPlayer);
      toast.info(
        `Selected ${clickedPlayer.lastName}. Now select a teammate to switch with.`,
      );
    }
  };

  const switchPlayerMutation = useMutation({
    mutationFn: (data: {
      fantasyTeamId: string;
      starterPlayerId: string;
      benchPlayerId: string;
    }) =>
      switchPlayer(
        data.fantasyTeamId,
        data.starterPlayerId,
        data.benchPlayerId,
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teamLineup", teamId] });
      toast.success("Player switched successfully");
      setSelectedTeamPlayer(null);
    },
    onError: (error) => {
      console.error("Error switching player:", error);
      toast.error("Failed to switch player");
    },
  });

  const isHighlight = (p: PlayerView) => {
    if (selectedTeamPlayer?.playerId === p.playerId) return true;

    if (selectedTeamPlayer) {
      const isSelectedInStarters = teamLineup?.starters.some(
        (s) => s.playerId === selectedTeamPlayer.playerId,
      );
      const isCurrentInStarters = teamLineup?.starters.some(
        (s) => s.playerId === p.playerId,
      );

      return (
        isSelectedInStarters !== isCurrentInStarters &&
        selectedTeamPlayer.position === p.position
      );
    }

    return isTarget(p.position);
  };

  const isRoundActive = league?.isRoundActive;

  const getPlayerPoints = (playerId: string) => {
    const playerEntry = teamPoints?.players?.find(
      (p: any) => p.playerId === playerId,
    );
    return playerEntry ? playerEntry.roundPoints.toString() : "0";
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <h1 className="text-3xl font-bold">{teamName}</h1>

      <div
        className={`relative w-fit border-2 rounded-2xl border-black dark:border-white transition-all duration-500 ${
          isRoundActive ? "ring-2 ring-red-500/50 shadow-inner" : ""
        }`}
      >
        <img
          src={halfCourt}
          alt="basketball half court"
          className="w-150 h-129 rounded-2xl relative"
          onClick={() => setSelectedTeamPlayer(null)}
        />

        <div className="absolute top-0 left-0 w-full h-full">
          <div
            className={
              isRoundActive ? "cursor-not-allowed pointer-events-none" : ""
            }
          >
            <div className="flex justify-center">
              {teamLineup &&
                teamLineup.starters
                  .filter((p) => p.position === "Center")
                  .map((p) => (
                    <div
                      key={p.playerId}
                      onClick={() => triggerSwap(p)}
                      className={`shrink-0 transition-all duration-300 rounded-xl ${
                        isHighlight(p)
                          ? "ring-4 ring-yellow-400 scale-105 z-20 cursor-pointer shadow-2xl"
                          : ""
                      }`}
                    >
                      <DraftLeaguePlayerCard
                        position="C"
                        jerseyNumber={p.jerseyNumber}
                        firstName={p.firstName}
                        lastName={p.lastName}
                        fantasyPoints={getPlayerPoints(p.playerId)}
                        isCaptain={teamLineup.captain.playerId == p.playerId}
                        onCaptainToggle={(e: React.MouseEvent) => {
                          e.stopPropagation();
                          if (isRoundActive) {
                            toast.warning(
                              "Cannot change captain during an active round!",
                            );
                            return;
                          }
                          changeCaptainMutation.mutate({
                            fantasyTeamId: teamId,
                            newCaptainPlayerId: p.playerId,
                          });
                        }}
                        isStarter={true}
                      />
                    </div>
                  ))}
            </div>

            <div className="flex px-15 justify-between w-full">
              {teamLineup &&
                teamLineup.starters
                  .filter((p) => p.position === "Forward")
                  .map((p) => (
                    <div
                      key={p.playerId}
                      onClick={() => triggerSwap(p)}
                      className={`shrink-0 transition-all duration-300 rounded-xl ${
                        isHighlight(p)
                          ? "ring-4 ring-yellow-400 scale-105 z-20 cursor-pointer shadow-2xl"
                          : ""
                      }`}
                    >
                      <DraftLeaguePlayerCard
                        position="F"
                        jerseyNumber={p.jerseyNumber}
                        firstName={p.firstName}
                        lastName={p.lastName}
                        fantasyPoints={getPlayerPoints(p.playerId)}
                        isCaptain={teamLineup.captain.playerId == p.playerId}
                        onCaptainToggle={(e: React.MouseEvent) => {
                          e.stopPropagation();
                          if (isRoundActive) {
                            toast.warning(
                              "Cannot change captain during an active round!",
                            );
                            return;
                          }
                          changeCaptainMutation.mutate({
                            fantasyTeamId: teamId,
                            newCaptainPlayerId: p.playerId,
                          });
                        }}
                        isStarter={true}
                      />
                    </div>
                  ))}
            </div>

            <div className="flex justify-center gap-10 w-full">
              {teamLineup &&
                teamLineup.starters
                  .filter((p) => p.position === "Guard")
                  .map((p) => (
                    <div
                      key={p.playerId}
                      onClick={() => triggerSwap(p)}
                      className={`shrink-0 transition-all duration-300 rounded-xl ${
                        isHighlight(p)
                          ? "ring-4 ring-yellow-400 scale-105 z-20 cursor-pointer shadow-2xl"
                          : ""
                      }`}
                    >
                      <DraftLeaguePlayerCard
                        position="G"
                        jerseyNumber={p.jerseyNumber}
                        firstName={p.firstName}
                        lastName={p.lastName}
                        fantasyPoints={getPlayerPoints(p.playerId)}
                        isCaptain={teamLineup.captain.playerId == p.playerId}
                        onCaptainToggle={(e: React.MouseEvent) => {
                          e.stopPropagation();
                          if (isRoundActive) {
                            toast.warning(
                              "Cannot change captain during an active round!",
                            );
                            return;
                          }

                          changeCaptainMutation.mutate({
                            fantasyTeamId: teamId,
                            newCaptainPlayerId: p.playerId,
                          });
                        }}
                        isStarter={true}
                      />
                    </div>
                  ))}
            </div>
          </div>

          <div className="flex mt-5 border-t-2 border-black dark:border-white overflow-hidden rounded-b-2xl backdrop-blur-xs h-34">
            <div
              className={`border-r-2 border-black dark:border-white w-35 flex shrink-0 justify-center items-center transition-all duration-300 ${(selectedFreePlayerCoach as any)?.position === "HC" ? "ring-4 ring-yellow-400 scale-105 z-20 cursor-pointer shadow-2xl bg-yellow-400/20" : ""}`}
              onClick={() => teamLineup && handleCoachClick(teamLineup.coach)}
            >
              {teamLineup && (
                <DraftLeagueCoachCard
                  firstName={teamLineup.coach.firstName}
                  lastName={teamLineup.coach.lastName}
                  fantasyPoints={
                    teamPoints?.coach?.roundPoints?.toString() || "0"
                  }
                />
              )}
            </div>

            <div className="flex flex-1 w-full justify-start gap-3 items-center min-w-0 overflow-x-auto h-full px-2">
              {teamLineup &&
                teamLineup.bench.map((p) => {
                  return (
                    <div
                      key={p.playerId}
                      onClick={() => triggerSwap(p)}
                      className={`shrink-0 transition-all duration-300 rounded-xl cursor-pointer hover:scale-105 ${isTarget(p.position) ? "ring-4 ring-yellow-400 scale-105 z-0 cursor-pointer shadow-2xl" : ""} ${
                        isRoundActive
                          ? "cursor-not-allowed pointer-events-none"
                          : ""
                      } ${
                        isHighlight(p)
                          ? "ring-4 ring-yellow-400 scale-105 z-20 cursor-pointer shadow-2xl"
                          : ""
                      }`}
                    >
                      <DraftLeaguePlayerCard
                        position={p.position[0]}
                        jerseyNumber={p.jerseyNumber}
                        firstName={p.firstName}
                        lastName={p.lastName}
                        fantasyPoints={getPlayerPoints(p.playerId)}
                        isCaptain={teamLineup.captain.playerId == p.playerId}
                        onCaptainToggle={() =>
                          changeCaptainMutation.mutate({
                            fantasyTeamId: teamId,
                            newCaptainPlayerId: p.playerId,
                          })
                        }
                        isStarter={false}
                      />
                    </div>
                  );
                })}
            </div>
          </div>
          {isRoundActive && (
            <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold animate-pulse z-50">
              ROUND LIVE - LINEUP LOCKED
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DraftLeagueCourt;
