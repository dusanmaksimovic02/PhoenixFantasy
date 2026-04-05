// import type { FC } from "react";
// import PlusMinusButtons from "../PlusMinusButtons";
// import type { Player } from "@/models/Player";
// import type { PlayerGameStats } from "@/models/PlayerGameStats";

// type Props = {
//   gameId: string;
//   selectedPlayer: Player;
//   teamId: string;
//   playerStats: PlayerGameStats;
//   isLoading: boolean;
// };

// const ReboundsSection: FC<Props> = (props) => {
//   return (
//     <div className="p-3 pr-0 w-full">
//       <div className="flex gap-10">
//         <p className="text-phoenix">Rebounds</p>
//         <p>{props.playerStats.rebounds}</p>
//       </div>
//       <div className="flex justify-between px-8 pt-3">
//         {(["offensive", "defensive"] as const).map((kind) => (
//           <div key={kind} className="flex flex-col justify-center items-center">
//             <div className="flex gap-3">
//               <p>{kind === "offensive" ? "Offensive" : "Defensive"}</p>
//               <p>{stats.rebounds[kind]}</p>
//             </div>

//             <PlusMinusButtons
//               onPlusClick={() => }
//               onMinusClick={() => dispatch({
//                 type: "rebound",
//                 payload: { kind, delta: -1 },
//               })}
//               minusDisable={() => stats.rebounds[kind] <= 0} plusDisabled={function (): boolean {
//                 throw new Error("Function not implemented.");
//               } }            />
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default ReboundsSection;
