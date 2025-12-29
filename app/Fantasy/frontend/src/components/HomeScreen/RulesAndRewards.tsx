import type { FC } from "react";

const RulesAndRewards: FC = () => {
  return (
    <div className="p-5 pt-10 flex gap-10 flex-col max-sm:justify-center max-sm:items-center font-palanquin ">
      <div className=" ">
        <h1 className="text-black dark:text-white font-extrabold text-4xl sm:pl-20">
          Rules And <span className="text-phoenix">Rewards</span>
        </h1>
      </div>
      <div className="flex flex-col sm:px-24 max-sm:px-5 gap-y-4">
        <h3 className="text-xl font-bold">
          The Phoenix Fantasy Basketball League is your chance to test your
          knowledge of the Phoenix League, with a unique drafting system and
          exciting rewards. Before you start, make sure to familiarize yourself
          with the rules that define our league!
        </h3>
        <div>
          <h3 className="text-2xl font-bold">Team Composition</h3>
          <br />
          <ul className="list-disc pl-10 space-y-2">
            <li>
              Each team must have 10 players on its roster, selected during the
              draft.
            </li>
            <li>
              Teams may have a maximum of:
              <ul className="list-disc pl-10 space-y-2">
                <li>2 PG (point guards)</li>
                <li>2 SG (shooting guards)</li>
                <li>2 SF (small forwards)</li>
                <li>2 PF (power forwards)</li>
                <li>2 C (centers)</li>
              </ul>
            </li>
            <li>
              During the draft, managers can pick players who are active members
              of the Phoenix League teams.
            </li>
            <li>
              Each player has a specific value based on their previous season
              and expected performance.
            </li>
          </ul>
        </div>
        <p>
          Fantasy Draft Drafting is the foundation of our league. Through a
          series of rounds, team managers select players to build their rosters
          for the season. The draft format is serpentine, meaning the manager
          with the last pick in the first round has the first pick in the second
          round, and so on. Draft Type: The league uses a Snake Draft format,
          where teams select players from a predefined list of available
          players. Each team picks one player per round until all rosters are
          full. Important: Participants must adhere to the time limit for making
          their picks. If a manager fails to pick within the given time, the
          best available player will be automatically assigned to them.
        </p>
        <div>
          <h3 className="text-2xl font-bold">Scoring System</h3>
          <br />
          <p>
            Points System Fantasy points are calculated based on real-life
            player statistics during Phoenix League games.
          </p>
          <p>The scoring rules are:</p>
          <ul className="list-disc pl-10 space-y-2">
            <li>Points: 1 point = 1 fantasy point</li>
            <li>Rebounds: 1 rebound = 1 fantasy point</li>
            <li>Assists: 1 assist = 1 fantasy point</li>
            <li>Blocks: 1 block = 2 fantasy points</li>
            <li>Steals: 1 steal = 2 fantasy points</li>
            <li>Turnovers: -1 point for each turnover</li>
            <li>Personal Fouls: -1 point for each personal foul</li>
          </ul>
        </div>
        <div>
          Transfers and Trades Transfers are allowed throughout the season, but
          managers can make only 4 transfers per round. Transfers can be made
          during periods when games are not being played. Trades with other
          teams are permitted and must be mutually agreed upon but require
          league administration approval to maintain balance. Yellow Card:
          Managers who fail to set their team or replace injured players may
          receive a warning and lose the ability to make free transfers for a
          specific period.
        </div>
        <p>
          Player Health Injured players can be replaced at any time, but
          managers must ensure appropriate replacements. Player statuses
          (health, injury, suspension) will be updated in real-time, and
          inactive players will not contribute points.
        </p>
        <p>
          Phoenix Fantasy Basketball League Rewards In the Phoenix League, top
          managers compete for prestigious rewards at the end of the season.
          Here’s how the prizes are distributed:
        </p>
        <p>
          1st Place – Phoenix League Champion The winning team receives: - A
          gift voucher for sports products (€100) or tickets to a Phoenix League
          game of their choice. - An exclusive Phoenix League trophy delivered
          to the champion at the end of the season. - A famous Phoenix League
          jersey with the name and number of one of the league’s best players.
        </p>
        <p>
          2nd Place – Silver Award The second-place team receives: - A gift
          voucher for €50 or a sports gadget of their choice (e.g., smartwatch,
          sports headphones, basketball). - A Phoenix League medal as
          recognition for outstanding performance.
        </p>
        <p>
          3rd Place – Bronze Award The third-place team receives: - A sports
          package (basketball, NBA team T-shirt of their choice). - A €30
          voucher for a sports store or a sports-related restaurant.
        </p>
        <p>
          Bonus Rewards: - Highest fantasy points in a single game during the
          season: €20 gift voucher. - Most successful transfers/trades during
          the season: A set of basketball merchandise (T-shirt, bag,
          basketball).
        </p>
      </div>
    </div>
  );
};

export default RulesAndRewards;
