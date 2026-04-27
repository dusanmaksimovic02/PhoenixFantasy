import { FantasyPointsContext } from "./FantasyPointsContext";
import { useEffect, type FC, type ReactNode } from "react";
import * as signalR from "@microsoft/signalr";
import { toast } from "react-toastify";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getFantasyLeague } from "../../services/FantasyLeagueService";

export const createDraftConnection = () => {
  return new signalR.HubConnectionBuilder()
    .withUrl("https://localhost:7035/fantasyHub")
    .withAutomaticReconnect()
    .build();
};

type Props = { children: ReactNode; teamId: string; leagueId: string };

export const FantasyPointsProvider: FC<Props> = ({
  children,
  teamId,
  leagueId,
}) => {
  const queryClient = useQueryClient();

  const { data: leagueData } = useQuery({
    queryKey: ["league", leagueId],
    queryFn: () => getFantasyLeague(leagueId),
  });

  useEffect(() => {
    const connection = createDraftConnection();

    const startConnection = async () => {
      try {
        await connection.start();
        console.log("SignalR Fantasy Points Connected!");

        await connection.invoke("JoinTeamGroup", teamId);
      } catch (err) {
        console.error("SignalR Fantasy Points Connection/Sync Error: ", err);
      }
    };

    connection.on("RoundStarted", async (data) => {
      console.log("RoundStarted: ", data);
      await queryClient.invalidateQueries({ queryKey: ["league", leagueId] });
      toast.info("Round started!");
    });

    connection.on("RoundEnded", async () => {
      console.log("RoundEnded: ");
      await queryClient.invalidateQueries({ queryKey: ["league", leagueId] });
      toast.info("Round ended!");
    });

    startConnection();

    return () => {
      connection.stop();
    };
  }, [queryClient, teamId]);

  return (
    <FantasyPointsContext.Provider
      value={{
        league: leagueData!,
      }}
    >
      {children}
    </FantasyPointsContext.Provider>
  );
};
