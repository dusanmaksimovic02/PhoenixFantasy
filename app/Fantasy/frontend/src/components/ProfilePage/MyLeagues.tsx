import type { FC } from "react";
import { FaArrowRight } from "react-icons/fa";

const mockLeagues = [
  "Prva",
  "Druga",
  "treca",
  "Cetvrta",
  "Peta",
];

const MyLeagues: FC = () => {
  return (
    <div className="w-full flex justify-center py-10">
      <div className="w-full max-w-4xl">
        <h1 className="text-3xl font-bold text-center mb-10">
          My Leagues
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {mockLeagues.map((league) => (
            <button
              key={league}
              onClick={() => console.log("Clicked league:", league)}
              className="
                w-full flex items-center justify-between
                px-6 py-5 rounded-2xl
                bg-phoenix/80 hover:bg-phoenix
                text-white text-lg font-semibold
                shadow-md transition
                cursor-pointer
              "
            >
              <span>{league}</span>
              <FaArrowRight />
            </button>
          ))}
        </div>

        <p className="text-center opacity-60 mt-10 text-sm">
          test lige
        </p>
      </div>
    </div>
  );
};

export default MyLeagues;
