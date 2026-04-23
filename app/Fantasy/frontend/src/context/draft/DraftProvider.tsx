import {
  useEffect,
  useState,
  useMemo,
  type FC,
  type ReactNode,
  useRef,
} from "react";
import { DraftContext } from "./DraftContext";
import { getDraftSession } from "../../services/CreateDraftLeagueService";
import { useQueryClient } from "@tanstack/react-query";
import * as signalR from "@microsoft/signalr";
import { toast } from "react-toastify";
import type { Player } from "../../models/Player";
import {
  freePlayersInLeague,
  getAllFreeCoaches,
} from "../../services/StatsService";
import type { CoachView } from "../../models/TeamLineUp";

export const createDraftConnection = () => {
  return new signalR.HubConnectionBuilder()
    .withUrl("https://localhost:7035/draftHub")
    .withAutomaticReconnect()
    .build();
};

type Props = {
  children: ReactNode;
  draftId: string;
  myTeamId: string;
  leagueId: string;
};

export const DraftProvider: FC<Props> = ({
  children,
  draftId,
  myTeamId,
  leagueId,
}) => {
  const [pickOrder, setPickOrder] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [deadline, setDeadline] = useState<string>("");
  const [draftStarted, setDraftStarted] = useState<boolean>(false);
  const [phase, setPhase] = useState<string>("Player");
  const pickOrderRef = useRef<any[]>([]);
  const queryClient = useQueryClient();
  const [availablePlayers, setAvailablePlayers] = useState<Player[]>([]);
  const [availableCoaches, setAvailableCoaches] = useState<CoachView[]>([]);

  useEffect(() => {
    if (!draftId) return;

    const connection = createDraftConnection();

    const startConnection = async () => {
      try {
        await connection.start();
        console.log("SignalR Connected!");

        await connection.invoke("JoinDraft", draftId);

        const data = await getDraftSession(draftId);
        console.log("Pokupio sam podatke o sesiji:", data);
        setPickOrder(data.pickOrder);
        setCurrentIndex(data.currentPickIndex ?? 0);
        const rawDeadline = data.pickDeadline;
        const utcDeadline = rawDeadline.endsWith("Z")
          ? rawDeadline
          : rawDeadline + "Z";

        setDeadline(utcDeadline);
        setDraftStarted(true);
        setPhase(
          data.phase == 0 ? "Player" : data.phase == 1 ? "Coach" : "Finished",
        );
        const players = await freePlayersInLeague(leagueId);
        setAvailablePlayers(players);
        const coaches = await getAllFreeCoaches(leagueId);
        setAvailableCoaches(coaches);
      } catch (err) {
        console.error("SignalR Connection/Sync Error: ", err);
      }
    };

    connection.on("DraftStarted", (data) => {
      console.log("DraftStarted", data);
      setDraftStarted(true);
      setPickOrder(data.pickOrder);
      setCurrentIndex(data.currentPickIndex);
      setDeadline(data.pickDeadline);
      setPhase(data.phase);
      queryClient.invalidateQueries({ queryKey: ["isLeagueStarted"] });
      queryClient.invalidateQueries({ queryKey: ["draftId"] });
    });

    connection.on("TurnChanged", (data) => {
      setCurrentIndex(data.currentPickIndex);
      const rawDeadline = data.pickDeadline;
      const utcDeadline = rawDeadline.endsWith("Z")
        ? rawDeadline
        : rawDeadline + "Z";
      setDeadline(utcDeadline);
    });

    connection.on("PlayerPicked", async (data) => {
      toast.info(
        `Player ${data.playerFull.firstName} ${data.playerFull.lastName} has been picked!`,
      );
      setAvailablePlayers((prevAvailable) =>
        prevAvailable.filter((p) => p.id !== data.playerFull.id),
      );
      queryClient.invalidateQueries({ queryKey: ["teamLineup", myTeamId] });
      const players = await freePlayersInLeague(leagueId);
      setAvailablePlayers(players);
    });

    connection.on("CoachPicked", async (data) => {
      console.log("Trener zauzet:", data.coachId);
      const coach = availableCoaches.filter((c) => c.id == data.coachId);
      toast.info(
        `Coach ${coach[0].firstName} ${coach[0].lastName} has been auto picked!`,
      );
      const coaches = await getAllFreeCoaches(leagueId);
      setAvailableCoaches(coaches);
      queryClient.invalidateQueries({ queryKey: ["teamLineup", myTeamId] });
    });

    connection.on("PhaseChanged", (newPhase) => {
      console.log("Nova faza drafta:", newPhase);
      setPhase(newPhase);
    });

    connection.on("PickSkipped", (data) => {
      console.log("Korisnik je preskočen, novi index:", data.currentPickIndex);
      setCurrentIndex(data.currentPickIndex);
      const rawDeadline = data.pickDeadline;
      const utcDeadline = rawDeadline.endsWith("Z")
        ? rawDeadline
        : rawDeadline + "Z";

      setDeadline(utcDeadline);
      console.log(pickOrderRef.current);
    });

    connection.on("AutoPick", async (data) => {
      toast.info(
        `Player ${data.player.firstName} ${data.player.lastName} has been auto picked!`,
      );
      setAvailablePlayers((prevAvailable) =>
        prevAvailable.filter((p) => p.id !== data.player.id),
      );
      queryClient.invalidateQueries({ queryKey: ["teamLineup", myTeamId] });
      const players = await freePlayersInLeague(leagueId);
      setAvailablePlayers(players);
    });

    startConnection();

    return () => {
      connection.stop();
    };
  }, [draftId]);

  useEffect(() => {
    pickOrderRef.current = pickOrder;
  }, [pickOrder]);

  const currentTurnTeamId = useMemo(() => {
    return pickOrder[currentIndex]?.fantasyTeamId;
  }, [pickOrder, currentIndex]);

  const isMyTurn = currentTurnTeamId === myTeamId;

  return (
    <DraftContext.Provider
      value={{
        currentTurn: currentTurnTeamId,
        deadline,
        draftStarted,
        isMyTurn,
        pickOrder,
        phase,
        availablePlayers,
        availableCoaches,
      }}
    >
      {children}
    </DraftContext.Provider>
  );
};
