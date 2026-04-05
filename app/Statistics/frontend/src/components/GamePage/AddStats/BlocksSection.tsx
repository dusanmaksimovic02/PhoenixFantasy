// import type { FC } from "react";
// import PlusMinusButtons from "../PlusMinusButtons";

// type Props = {};

// const BlocksSection: FC<Props> = ({}) => {
//   return (
//     <div className="p-3 pb-10 w-[35%]  border-r">
//       <p className="text-phoenix">Blocks</p>
//       <div className="flex flex-col justify-around h-full pl-3">
//         {(
//           [
//             { field: "blocksFor", label: "For" },
//             { field: "blocksAgainst", label: "Against" },
//           ] as const
//         ).map(({ field, label }) => (
//           <div key={field} className="flex justify-between items-center">
//             <div className="flex gap-2">
//               <p>{label}</p>
//               <p></p>
//             </div>

//             <PlusMinusButtons onPlusClick={} onMinusClick={} minusDisable={} />
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default BlocksSection;
