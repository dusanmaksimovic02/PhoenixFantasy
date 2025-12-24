import type { FC } from "react";

const GameInfo: FC = () => {
  return (
    <>
      <h3 className="text-center text-black dark:text-white font-semibold">
        Result by quarters
      </h3>

      <br />

      <div className="w-full overflow-hidden rounded-lg border-2 border-surface">
        <table className="w-full">
          <thead className="border-2 border-surface bg-surface-light text-foreground dark:bg-surface-dark">
            <tr>
              <th className="px-2.5 py-2 text-start">Team</th>
              <th className="px-2.5 py-2 text-center">1</th>
              <th className="px-2.5 py-2 text-center">2</th>
              <th className="px-2.5 py-2 text-center">3</th>
              <th className="px-2.5 py-2 text-center">4</th>
            </tr>
          </thead>
          <tbody className="group text-black dark:text-white">
            <tr className="border-b border-surface ">
              <td className="p-3">Team 1</td>
              <td className="p-3 text-center">23</td>
              <td className="p-3 text-center">15</td>
              <td className="p-3 text-center bg-phoenix">19</td>
              <td className="p-3 text-center bg-phoenix">33</td>
            </tr>
            <tr className="border-b border-surface last:border-0">
              <td className="p-3">Team 2</td>
              <td className="p-3 bg-phoenix text-center">26</td>
              <td className="p-3 text-center  bg-phoenix">16</td>
              <td className="p-3 text-center">13</td>
              <td className="p-3 text-center">28</td>
            </tr>
          </tbody>
        </table>
      </div>

      <br />

      <h3 className="text-center text-black dark:text-white font-semibold">
        Result by end of quarters
      </h3>

      <br />

      <div className="w-full overflow-hidden rounded-lg border-2 border-surface">
        <table className="w-full">
          <thead className="border-2 border-surface bg-surface-light text-foreground dark:bg-surface-dark">
            <tr>
              <th className="px-2.5 py-2 text-start">Team</th>
              <th className="px-2.5 py-2 text-center">1</th>
              <th className="px-2.5 py-2 text-center">2</th>
              <th className="px-2.5 py-2 text-center">3</th>
              <th className="px-2.5 py-2 text-center">4</th>
            </tr>
          </thead>
          <tbody className="group text-black dark:text-white">
            <tr className="border-b border-surface last:border-0">
              <td className="p-3">Team 1</td>
              <td className="p-3 text-center">23</td>
              <td className="p-3 text-center">38</td>
              <td className="p-3 text-center bg-phoenix">57</td>
              <td className="p-3 text-center bg-phoenix">90</td>
            </tr>
            <tr className="border-b border-surface last:border-0">
              <td className="p-3">Team 2</td>
              <td className="p-3 text-center bg-phoenix">26</td>
              <td className="p-3 text-center bg-phoenix">42</td>
              <td className="p-3 text-center">55</td>
              <td className="p-3 text-center">83</td>
            </tr>
          </tbody>
        </table>
      </div>

      <br />

      <h3 className="text-center text-black dark:text-white font-semibold">
        Game leaders
      </h3>

      <br />

      <div className="w-full overflow-hidden rounded-lg border-2 border-surface">
        <table className="w-full">
          <thead className="border-2 border-surface bg-surface-light text-phoenix font-bold text-2xl dark:bg-surface-dark">
            <tr>
              <th className="px-2.5 py-2 text-center">Player</th>
              <th className="px-2.5 py-2 text-center"></th>
              <th className="px-2.5 py-2 text-center">by</th>
              <th className="px-2.5 py-2 text-center"></th>
              <th className="px-2.5 py-2 text-center">Player</th>
            </tr>
          </thead>
          <tbody className="group text-black dark:text-white">
            <tr className="border-2 border-surface  even:bg-surface-light dark:even:bg-surface-dark">
              <td className="p-3 text-center">Player 1</td>
              <td className="p-3 text-center">26.9</td>
              <td className="p-3 text-center font-bold text-lg">
                Performance Index Rating
              </td>
              <td className="p-3 text-center">32.5</td>
              <td className="p-3 text-center">Player 2</td>
            </tr>
            <tr className="border-2 border-surface last:border-0 even:bg-surface-light dark:even:bg-surface-dark">
              <td className="p-3 text-center">Player 1</td>
              <td className="p-3 text-center">+23</td>
              <td className="p-3 text-center font-bold text-lg">+/- Index</td>
              <td className="p-3 text-center">+14</td>
              <td className="p-3 text-center">Player 2</td>
            </tr>
            <tr className="border-2 border-surface last:border-0 even:bg-surface-light dark:even:bg-surface-dark">
              <td className="p-3 text-center">Player 1</td>
              <td className="p-3 text-center">21</td>
              <td className="p-3 text-center font-bold text-lg">Points</td>
              <td className="p-3 text-center">29</td>
              <td className="p-3 text-center">Player 2</td>
            </tr>
            <tr className="border-2 border-surface last:border-0 even:bg-surface-light dark:even:bg-surface-dark">
              <td className="p-3 text-center">Player 1</td>
              <td className="p-3 text-center">6</td>
              <td className="p-3 text-center font-bold text-lg">Assist</td>
              <td className="p-3 text-center">3</td>
              <td className="p-3 text-center">Player 2</td>
            </tr>
            <tr className="border-2 border-surface last:border-0 even:bg-surface-light dark:even:bg-surface-dark">
              <td className="p-3 text-center">Player 1</td>
              <td className="p-3 text-center">12</td>
              <td className="p-3 text-center font-bold text-lg">Rebounds</td>
              <td className="p-3 text-center">8</td>
              <td className="p-3 text-center">Player 2</td>
            </tr>
            <tr className="border-2 border-surface last:border-0 even:bg-surface-light dark:even:bg-surface-dark">
              <td className="p-3 text-center">Player 1</td>
              <td className="p-3 text-center">33.5</td>
              <td className="p-3 text-center font-bold text-lg">
                Minutes Played
              </td>
              <td className="p-3 text-center">35.9</td>
              <td className="p-3 text-center">Player 2</td>
            </tr>
            <tr className="border-2 border-surface last:border-0 even:bg-surface-light dark:even:bg-surface-dark">
              <td className="p-3 text-center">Player 1</td>
              <td className="p-3 text-center">2</td>
              <td className="p-3 text-center font-bold text-lg">Steals</td>
              <td className="p-3 text-center">1</td>
              <td className="p-3 text-center">Player 2</td>
            </tr>
            <tr className="border-2 border-surface last:border-0 even:bg-surface-light dark:even:bg-surface-dark">
              <td className="p-3 text-center">Player 1</td>
              <td className="p-3 text-center">0</td>
              <td className="p-3 text-center font-bold text-lg">Block</td>
              <td className="p-3 text-center">3</td>
              <td className="p-3 text-center">Player 2</td>
            </tr>
            <tr className="border-2 border-surface last:border-0 even:bg-surface-light dark:even:bg-surface-dark">
              <td className="p-3 text-center">Player 1</td>
              <td className="p-3 text-center">4</td>
              <td className="p-3 text-center font-bold text-lg">Turnovers</td>
              <td className="p-3 text-center">4</td>
              <td className="p-3 text-center">Player 2</td>
            </tr>
            <tr className="border-2 border-surface last:border-0 even:bg-surface-light dark:even:bg-surface-dark">
              <td className="p-3 text-center">Player 1</td>
              <td className="p-3 text-center">92%</td>
              <td className="p-3 text-center font-bold text-lg">
                Free Throws Percentage
              </td>
              <td className="p-3 text-center">100%</td>
              <td className="p-3 text-center">Player 2</td>
            </tr>
            <tr className="border-2 border-surface last:border-0 even:bg-surface-light dark:even:bg-surface-dark">
              <td className="p-3 text-center">Player 1</td>
              <td className="p-3 text-center">95%</td>
              <td className="p-3 text-center font-bold text-lg">
                Two Points Percentage
              </td>
              <td className="p-3 text-center">78%</td>
              <td className="p-3 text-center">Player 2</td>
            </tr>
            <tr className="border-2 border-surface last:border-0 even:bg-surface-light dark:even:bg-surface-dark">
              <td className="p-3 text-center">Player 1</td>
              <td className="p-3 text-center">100%</td>
              <td className="p-3 text-center font-bold text-lg">
                Three Points Percentage
              </td>
              <td className="p-3 text-center">59%</td>
              <td className="p-3 text-center">Player 2</td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
};

export default GameInfo;
