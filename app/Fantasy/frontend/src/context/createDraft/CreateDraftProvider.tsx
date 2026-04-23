import { useEffect, type FC, type ReactNode } from "react";
import * as signalR from "@microsoft/signalr";
import { toast } from "react-toastify";
import { CreateDraftContext } from "./CreateDraftContext";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../auth/useAuth";
import { useNavigate } from "react-router-dom";

export const createDraftConnection = () => {
  return new signalR.HubConnectionBuilder()
    .withUrl("https://localhost:7035/createDraftHub")
    .withAutomaticReconnect()
    .build();
};

type Props = {
  children: ReactNode;
  draftId: string;
  myTeamId: string;
  leagueId: string;
};

export const CreateDraftProvider: FC<Props> = ({ children, leagueId }) => {
  const queryClient = useQueryClient();
  const { id } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!leagueId) return;

    const connection = createDraftConnection();

    const startConnection = async () => {
      try {
        await connection.start();
        console.log("SignalR Create Draft League Connected!");

        await connection.invoke("JoinCreateDraft", leagueId);
      } catch (err) {
        console.error(
          "SignalR Create Draft League Connection/Sync Error: ",
          err,
        );
      }
    };

    connection.on("CreateDraftStarted", (data) => {
      console.log("CreateDraftStarted", data);
    });

    connection.on("DeleteLeague", (data) => {
      console.log("Delete League", data);
      toast.error("League has been deleted");
      navigate("/fantasy");
    });

    connection.on("JoinLeague", async (data) => {
      console.log("Join League", data);
      queryClient.invalidateQueries({
        queryKey: ["leagueParticipant", leagueId],
      });
      toast.info(data.teamName + " joined league!");
    });

    connection.on("RemovePlayerFromLeague", (data) => {
      console.log("RemovePlayerFromLeague:", data);
      queryClient.invalidateQueries({
        queryKey: ["leagueParticipant", leagueId],
      });
      if (data.userId == id) {
        toast.error("You're kicked out");
        navigate("/fantasy");
      }
    });

    connection.on("LeagueStarted", (data) => {
      console.log("LeagueStarted:", data);
      queryClient.invalidateQueries({ queryKey: ["isLeagueStarted"] });
      queryClient.invalidateQueries({ queryKey: ["draftId"] });
    });

    startConnection();

    return () => {
      connection.stop();
    };
  }, []);

  return (
    <CreateDraftContext.Provider value={{}}>
      {children}
    </CreateDraftContext.Provider>
  );
};
