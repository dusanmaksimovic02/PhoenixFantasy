import type { FantasyLeague } from "@/models/FantasyLeague";
import { useAuth } from "../../context/auth/useAuth";
import { getFantasyLeaguesFroUser } from "../../services/CreateDraftLeagueService";
import { useQuery } from "@tanstack/react-query";
import type { FC } from "react";
import { FaArrowRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const MyLeagues: FC = () => {
  const navigate = useNavigate();

  const { id } = useAuth();

  const { data: userLeagues } = useQuery({
    queryKey: ["userLeagues", id],
    queryFn: () => getFantasyLeaguesFroUser(id),
  });

  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-4xl">
        <h1 className="text-3xl font-bold text-center mb-10">My Leagues</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {userLeagues &&
            userLeagues.map((league: FantasyLeague) => (
              <button
                key={league.id}
                onClick={() => {
                  const res = {
                    leagueId: league.id,
                    leagueName: league.leagueName,
                    joinCode: league.joinCode,
                    teamId: league.teamId,
                    teamName: league.teamName,
                  };
                  if (league.isDraftStarted)
                    navigate(`/fantasy/draft/${league.leagueName}`, {
                      state: {
                        leagueId: league.id,
                        teamId: res.teamId,
                        teamName: res.teamName,
                      },
                    });
                  else
                    navigate(
                      `/fantasy/draft/${league.leagueName}/${league.joinCode}`,
                      {
                        state: {
                          res,
                        },
                      },
                    );
                }}
                className=" w-full flex items-center justify-between px-6 py-5 rounded-2xl  bg-phoenix/80 hover:bg-phoenix text-white text-lg font-semibold shadow-md transition cursor-pointer"
              >
                <span>{league.leagueName}</span>
                <FaArrowRight />
              </button>
            ))}
        </div>
      </div>
    </div>
  );
};

export default MyLeagues;
