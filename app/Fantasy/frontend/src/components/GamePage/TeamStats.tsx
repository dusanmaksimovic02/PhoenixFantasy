import type { FC } from "react";

const TeamStats:FC = () => {
  return (
    <div className="w-full overflow-hidden rounded-lg border-2 border-surface">
      <table className="w-full">

        <tbody className="group text-black dark:text-white">
          <tr className="border-2 border-surface last:border-0 even:bg-surface-light dark:even:bg-surface-dark">
            <td className="p-3 text-center bg-phoenix">112.4</td>
            <td className="p-3 text-center font-bold text-lg">
              Performance Index Rating
            </td>
            <td className="p-3 text-center">102</td>
          </tr>
          <tr className="border-2 border-surface last:border-0 even:bg-surface-light dark:even:bg-surface-dark">
            <td className="p-3 text-center bg-phoenix">112</td>
            <td className="p-3 text-center font-bold text-lg">Points</td>
            <td className="p-3 text-center">105</td>
          </tr>
          <tr className="border-2 border-surface last:border-0 even:bg-surface-light dark:even:bg-surface-dark">
            <td className="p-3 text-center">20</td>
            <td className="p-3 text-center font-bold text-lg">Assist</td>
            <td className="p-3 text-center bg-phoenix">22</td>
          </tr>
          <tr className="border-2 border-surface last:border-0 even:bg-surface-light dark:even:bg-surface-dark">
            <td className="p-3 text-center bg-phoenix">18</td>
            <td className="p-3 text-center font-bold text-lg">Defensive Rebounds</td>
            <td className="p-3 text-center">17</td>
          </tr>
          <tr className="border-2 border-surface last:border-0 even:bg-surface-light dark:even:bg-surface-dark">
            <td className="p-3 text-center">5</td>
            <td className="p-3 text-center font-bold text-lg">Offensive Rebounds</td>
            <td className="p-3 text-center bg-phoenix">12</td>
          </tr>
          <tr className="border-2 border-surface last:border-0 even:bg-surface-light dark:even:bg-surface-dark">
            <td className="p-3 text-center">23</td>
            <td className="p-3 text-center font-bold text-lg">Total Rebounds</td>
            <td className="p-3 text-center bg-phoenix">29</td>
          </tr>
          <tr className="border-2 border-surface last:border-0 even:bg-surface-light dark:even:bg-surface-dark">
            <td className="p-3 text-center bg-phoenix">6</td>
            <td className="p-3 text-center font-bold text-lg">Steals</td>
            <td className="p-3 text-center">5</td>
          </tr>
          <tr className="border-2 border-surface last:border-0 even:bg-surface-light dark:even:bg-surface-dark">
            <td className="p-3 text-center">1</td>
            <td className="p-3 text-center font-bold text-lg">Block</td>
            <td className="p-3 text-center bg-phoenix">3</td>
          </tr>
          <tr className="border-2 border-surface last:border-0 even:bg-surface-light dark:even:bg-surface-dark">
            <td className="p-3 text-center">12</td>
            <td className="p-3 text-center font-bold text-lg">Turnovers</td>
            <td className="p-3 text-center bg-phoenix">9</td>
          </tr>
          <tr className="border-2 border-surface last:border-0 even:bg-surface-light dark:even:bg-surface-dark">
            <td className="p-3 text-center">12</td>
            <td className="p-3 text-center font-bold text-lg">
              Free Throws Made
            </td>
            <td className="p-3 text-center bg-phoenix">16</td>
          </tr>
          <tr className="border-2 border-surface last:border-0 even:bg-surface-light dark:even:bg-surface-dark">
            <td className="p-3 text-center">16</td>
            <td className="p-3 text-center font-bold text-lg">
              Free Throws Attempted
            </td>
            <td className="p-3 text-center bg-phoenix">18</td>
          </tr>
          <tr className="border-2 border-surface last:border-0 even:bg-surface-light dark:even:bg-surface-dark">
            <td className="p-3 text-center">84%</td>
            <td className="p-3 text-center font-bold text-lg">
              Free Throws Percentage
            </td>
            <td className="p-3 text-center bg-phoenix">92%</td>
          </tr>
          <tr className="border-2 border-surface last:border-0 even:bg-surface-light dark:even:bg-surface-dark">
            <td className="p-3 text-center">12</td>
            <td className="p-3 text-center font-bold text-lg">
              Three Points Made
            </td>
            <td className="p-3 text-center bg-phoenix">13</td>
          </tr>
          <tr className="border-2 border-surface last:border-0 even:bg-surface-light dark:even:bg-surface-dark">
            <td className="p-3 text-center">24</td>
            <td className="p-3 text-center font-bold text-lg">
              Three Points Attempted
            </td>
            <td className="p-3 text-center bg-phoenix">29</td>
          </tr>
          <tr className="border-2 border-surface last:border-0 even:bg-surface-light dark:even:bg-surface-dark">
            <td className="p-3 text-center bg-phoenix">63%</td>
            <td className="p-3 text-center font-bold text-lg">
              Three Points Percentage
            </td>
            <td className="p-3 text-center">43%</td>
          </tr>
          <tr className="border-2 border-surface last:border-0 even:bg-surface-light dark:even:bg-surface-dark">
            <td className="p-3 text-center bg-phoenix">23</td>
            <td className="p-3 text-center font-bold text-lg">
              Two Points Made
            </td>
            <td className="p-3 text-center">20</td>
          </tr>
          <tr className="border-2 border-surface last:border-0 even:bg-surface-light dark:even:bg-surface-dark">
            <td className="p-3 text-center bg-phoenix">34</td>
            <td className="p-3 text-center font-bold text-lg">
              Two Points Attempted
            </td>
            <td className="p-3 text-center">41</td>
          </tr>
          <tr className="border-2 border-surface last:border-0 even:bg-surface-light dark:even:bg-surface-dark">
            <td className="p-3 text-center bg-phoenix">74%</td>
            <td className="p-3 text-center font-bold text-lg">
              TwoPoints Percentage
            </td>
            <td className="p-3 text-center">59%</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default TeamStats;
