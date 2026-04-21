import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, type FC } from "react";
import Players from "../components/TeamPage/Players";
import Coaches from "../components/TeamPage/Coaches";
import Games from "../components/TeamPage/Games";
import PlayersStats from "../components/TeamPage/PlayersStats";
import TeamStats from "../components/TeamPage/TeamStats";
import type { TeamStanding } from "../models/TeamStanding";

const clubHistoryText: { [key: number]: string } = {
  1: "The Phoenix Suns are a professional basketball team based in Phoenix, Arizona, founded in 1968. Although they have never won an NBA championship, they have consistently been a competitive team in the league. The Suns have had several successful seasons, including memorable playoff runs in the 1990s and more recently in the 2020s. Known for their up-tempo style of play, fast break offense, and reliance on the three-point shot, the Suns have built a strong fanbase and have been one of the top teams in the Western Conference.",
  2: "The Golden State Warriors are one of the most successful and well-known teams in NBA history. Founded in 1946, the Warriors have won multiple championships, including recent titles in 2015, 2017, and 2018. Known for their revolutionary 'small ball' style and three-point shooting, the Warriors changed the game with the help of stars like Stephen Curry, Klay Thompson, and Draymond Green. The team's dominance in the 2010s, with their incredible shooting and fast-paced offense, has cemented them as one of the modern NBA dynasties.",
  3: "The Los Angeles Lakers are one of the most storied franchises in NBA history, founded in 1947. With 17 NBA championships, tied for the most in league history, the Lakers have been home to some of the greatest players ever, including Magic Johnson, Kareem Abdul-Jabbar, Kobe Bryant, and LeBron James. Known for their glamorous reputation, the Lakers have dominated the league in various eras, from the 'Showtime' era in the 1980s to the more recent successes in the 2000s and 2020s.",
  4: "The Boston Celtics are one of the oldest and most successful teams in NBA history. Founded in 1946, the Celtics have won 17 championships, tied with the Los Angeles Lakers for the most in NBA history. The team is known for its storied tradition, success in the 1950s and 1960s, and iconic players such as Bill Russell, Larry Bird, and Paul Pierce. The Celtics' commitment to team play and their legendary rivalry with the Lakers has made them one of the most iconic teams in the sport.",
  5: "The Milwaukee Bucks, founded in 1968, have become a dominant force in the NBA in recent years, particularly after winning the NBA championship in 2021. The team is led by Giannis Antetokounmpo, one of the best players of his generation. The Bucks have had a rich history but rose to prominence in the modern era due to their strong defense, versatile offense, and the remarkable development of Giannis into a two-time MVP and NBA Finals MVP. Their success has revitalized the basketball culture in Milwaukee and established the Bucks as a top contender in the Eastern Conference.",
  6: "The Miami Heat, established in 1988, quickly became a major force in the NBA, especially after the arrival of superstar Dwyane Wade. The team gained national prominence in the 2000s, winning its first NBA championship in 2006. However, the most defining moment in the franchise's history came in 2010, when LeBron James and Chris Bosh joined Wade to form a 'Big Three.' The Heat went on to win two more championships in 2012 and 2013. Known for their tough defense, hard-nosed play, and strong team culture, the Miami Heat have consistently been a contender in the Eastern Conference.",
  7: "The Dallas Mavericks were founded in 1980 and have had a steady presence in the NBA over the years. Their greatest achievement came in 2011 when they won the NBA Championship, led by future Hall of Famer Dirk Nowitzki. The Mavericks have been known for their innovative approach to the game, with a focus on advanced analytics and the use of a versatile, skilled player in Nowitzki. Since their championship win, the Mavs have continued to be a competitive team, with Luka Dončić emerging as one of the league's brightest stars.",
  8: "The Philadelphia 76ers, founded in 1946, are one of the oldest and most storied franchises in NBA history. With three championships to their name, the 76ers have seen success in various eras, from the dominance of Wilt Chamberlain in the 1960s to the 'Process' era in the 2010s, which focused on rebuilding with young stars like Joel Embiid and Ben Simmons. The 76ers are known for their passionate fanbase and strong historical presence, and they continue to be a force in the Eastern Conference with their star power and high-level play.",
  9: "The Denver Nuggets, founded in 1967, have been a competitive team in the NBA, gaining recognition for their high-scoring offenses and unique style of play. They are particularly known for their MVP-winning center Nikola Jokić, who has revolutionized the center position with his incredible passing and playmaking skills. The Nuggets have yet to win an NBA championship, but they have consistently been a playoff contender, and with Jokić leading the way, they are one of the most exciting teams to watch in the league today.",
  10: "The Chicago Bulls, established in 1966, are one of the most iconic teams in NBA history, largely due to their success in the 1990s when they won six NBA championships under the leadership of Michael Jordan. The Bulls became a global phenomenon, with Jordan becoming the face of the NBA and a cultural icon. Alongside Jordan, Scottie Pippen, and coach Phil Jackson, the Bulls dominated the decade, cementing their legacy as one of the greatest dynasties in sports history. Although their success has been less frequent since the 1990s, the Bulls remain a beloved franchise with a rich history.",
};

const TeamPage: FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const id = location.state?.id as number;
  const team = location.state?.team as TeamStanding;
  const position = location.state?.index as number;

  const hash = location.hash;

  const setHash = (value: string) => {
    navigate({ hash: value }, { replace: true, state: location.state });
  };

  useEffect(() => {
    const allowed = [
      "",
      "#club-history",
      "#players",
      "#coaches",
      "#games",
      "#players-stats",
      "#team-stats",
    ];

    if (!allowed.includes(hash)) {
      navigate({ hash: "" }, { replace: true });
    }
  }, [hash, navigate]);

  const history = clubHistoryText[id];
  console.log(team);

  return (
    <>
      <div className="pt-14 h-fit w-screen font-palanquin min-h-screen ">
        <div className="max-sm:bg-center bg-phoenix/95 h-fit w-full p-10 max-sm:p-0 max-sm:h-svh">
          <div className="h-fit flex max-sm:flex-col justify-between items-center gap-5  p-7  max-sm:p-0 rounded-2xl max-sm:h-svh max-sm:justify-around">
            <div className="flex max-sm:flex-col gap-5 justify-center items-center">
              <img
                src={`${team?.logoPathUrl}`}
                alt={`${team?.teamName.toLowerCase()} logo`}
                className="w-40 h-40 "
              />
              <p className="text-5xl max-sm:text-4xl font-extrabold text-nowrap">
                {team?.teamName}
              </p>
            </div>
            <p className="text-2xl font-bold">
              Position: <span>{position + 1}</span>
            </p>
            <div className="flex justify-center items-center gap-2">
              <div className="text-center">
                <p>Won</p>
                <br />
                <p className="text-4xl font-palanquin">{team?.wins}</p>
              </div>
              <hr className="rotate-90 w-20 bg-black" />
              <div className="text-center">
                <p>Lost</p>
                <br />
                <p className="text-4xl font-palanquin">{team?.losses}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full tabs rounded-none  tabs-box flex justify-around bg-white   border-white dark:bg-custom-gray dark:border-black p-0 border-0">
          <input
            type="radio"
            name="game_tabs"
            className="tab bg-phoenix/80 hover:bg-phoenix flex-1 rounded-none checked:bg-phoenix"
            aria-label="Club history"
            checked={hash === "" || hash === "#club-history"}
            onChange={() => setHash("#club-history")}
          />
          <div className="tab-content border-none p-6 bg-white dark:bg-custom-gray">
            {(hash === "" || hash === "#club-history") && history}
          </div>
          <input
            type="radio"
            name="game_tabs"
            className="tab bg-phoenix/80 hover:bg-phoenix  flex-1 rounded-none checked:bg-phoenix"
            aria-label="Players"
            checked={hash === "#players"}
            onChange={() => setHash("#players")}
          />
          <div className="tab-content border-none p-6 bg-white dark:bg-custom-gray">
            {hash === "#players" && <Players teamId={team.teamId} />}
          </div>
          <input
            type="radio"
            name="game_tabs"
            className="tab bg-phoenix/80 hover:bg-phoenix flex-1 rounded-none checked:bg-phoenix"
            aria-label="Coaches"
            checked={hash === "#coaches"}
            onChange={() => setHash("#coaches")}
          />
          <div className="tab-content border-none p-6 bg-white dark:bg-custom-gray">
            {hash === "#coaches" && <Coaches teamId={team.teamId} />}
          </div>
          <input
            type="radio"
            name="game_tabs"
            className="tab bg-phoenix/80 hover:bg-phoenix  flex-1 rounded-none checked:bg-phoenix"
            aria-label="Games"
            checked={hash === "#games"}
            onChange={() => setHash("#games")}
          />
          <div className="tab-content border-none p-6 bg-white dark:bg-custom-gray">
            {hash === "#games" && <Games teamId={team.teamId} />}
          </div>
          <input
            type="radio"
            name="game_tabs"
            className="tab bg-phoenix/80 hover:bg-phoenix  flex-1 rounded-none checked:bg-phoenix"
            aria-label="Players Stats"
            checked={hash === "#players-stats"}
            onChange={() => setHash("#players-stats")}
          />
          <div className="tab-content border-none p-6 bg-white dark:bg-custom-gray">
            {hash === "#players-stats" && <PlayersStats players={[]} />}
          </div>
          <input
            type="radio"
            name="game_tabs"
            className="tab bg-phoenix/80 hover:bg-phoenix  flex-1 rounded-none checked:bg-phoenix"
            aria-label="Team Stats"
            checked={hash === "#team-stats"}
            onChange={() => setHash("#team-stats")}
          />
          <div className="tab-content border-none p-6 bg-white dark:bg-custom-gray">
            {hash === "#team-stats" && <TeamStats />}
          </div>
        </div>
      </div>
    </>
  );
};

export default TeamPage;
