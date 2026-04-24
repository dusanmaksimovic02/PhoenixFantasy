import type { FantasyLeague } from "@/models/FantasyLeague";
import { useAuth } from "../../context/auth/useAuth";
import { getFantasyLeaguesFroUser } from "../../services/CreateDraftLeagueService";
import { useQuery } from "@tanstack/react-query";
import { type FC } from "react";
import { FaArrowRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const YourDraftLeagues: FC = () => {
  const navigate = useNavigate();

  const { id } = useAuth();

  const { data: userLeagues } = useQuery({
    queryKey: ["userLeagues", id],
    queryFn: () => getFantasyLeaguesFroUser(id),
  });

  return (
    <div className="h-full w-[47%] max-sm:w-full flex text-center flex-col justify-center items-center">
      <h4 className="mb-10 mt-5">Your draft Leagues</h4>
      <div className="w-full h-full justify-center items-center  flex flex-col">
        {userLeagues && userLeagues.length > 0 ? (
          userLeagues.map((league: FantasyLeague) => (
            <button
              className="btn text-black dark:text-white bg-phoenix/80 hover:bg-phoenix hover:border-phoenix border-phoenix hover:border-4 hover:cursor-pointer shadow-inner drop-shadow min-w-50 max-w-full max-sm:max-w-svw overflow-auto w-fit h-fit min-h-15 rounded-2xl text-xl mt-5 p-3 max-sm:text-[1.1rem] max-sm:min-w-45 max-sm:mt-5 flex justify-between items-center "
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
                  navigate(`draft/${league.leagueName}`, {
                    state: {
                      leagueId: league.id,
                    },
                  });
                else
                  navigate(`draft/${league.leagueName}/${league.joinCode}`, {
                    state: {
                      res,
                    },
                  });
              }}
            >
              {league.leagueName}
              <FaArrowRight />
            </button>
          ))
        ) : (
          <h5>You haven’t joined any leagues yet 😔</h5>
        )}
      </div>
    </div>
  );
};

export default YourDraftLeagues;
