import { type FC } from "react";
import GameCard from "./GameCard";
import { useQuery } from "@tanstack/react-query";
import { getAllGamesForReferee } from "../../services/RefereeService";
import type { Game } from "../../models/Game";
import Loading from "../Loading";
import { useAuth } from "../../context/auth/useAuth";

const YourMatches: FC = () => {
  const { id } = useAuth();

  const { data: games = [], isLoading } = useQuery({
    queryKey: ["refereeGames"],
    queryFn: () => getAllGamesForReferee(id),
  });

  if (isLoading) return <Loading />;

  return (
    <>
      <div className="flex gap-5 justify-center items-center flex-wrap p-5 py-8 ">
        {games.map((game: Game) => (
          <GameCard key={game.id} game={game}></GameCard>
        ))}
      </div>
    </>
  );
};

export default YourMatches;
