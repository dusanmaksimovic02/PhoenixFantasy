import { type FC } from "react";

interface Player {
  id: string;
  jerseyNumber: string;
  firstName: string;
  lastName: string;
  fantasyPoints: string;
}

interface RoundInfoPanelProps {
  captainId: string | null;
}


const MOCK_STARTERS: Player[] = [
  { id: "1", jerseyNumber: "10", firstName: "Nikola", lastName: "Jokic", fantasyPoints: "24.5" },
  { id: "2", jerseyNumber: "23", firstName: "LeBron", lastName: "James", fantasyPoints: "18.0" },
  { id: "3", jerseyNumber: "34", firstName: "Giannis", lastName: "Antetokounmpo", fantasyPoints: "21.0" },
  { id: "4", jerseyNumber: "30", firstName: "Stephen", lastName: "Curry", fantasyPoints: "15.5" },
  { id: "5", jerseyNumber: "11", firstName: "Kyrie", lastName: "Irving", fantasyPoints: "12.0" },
];

const MOCK_COACH = {
  firstName: "Gregg",
  lastName: "Popovich",
  fantasyPoints: "5.0",
};

const MOCK_BENCH: Player[] = [
  { id: "6", jerseyNumber: "3", firstName: "Chris", lastName: "Paul", fantasyPoints: "8.0" },
  { id: "7", jerseyNumber: "7", firstName: "Kevin", lastName: "Durant", fantasyPoints: "6.5" },
  { id: "8", jerseyNumber: "9", firstName: "Kawhi", lastName: "Leonard", fantasyPoints: "5.0" },
  { id: "9", jerseyNumber: "2", firstName: "Jayson", lastName: "Tatum", fantasyPoints: "7.0" },
  { id: "10", jerseyNumber: "15", firstName: "Joel", lastName: "Embiid", fantasyPoints: "9.5" },
];

const MOCK_ROUND = 1;
const MOCK_IS_ACTIVE = true;
const MOCK_TOTAL_POINTS = 91.0;

const RoundInfoPanel: FC<RoundInfoPanelProps> = ({ captainId }) => {
  const captain = [...MOCK_STARTERS, ...MOCK_BENCH].find(
    (p) => p.id === captainId
  );

  return (
    <div className="w-full rounded-2xl bg-neutral-100 dark:bg-neutral-800 shadow-md overflow-hidden">
      
      <div className="bg-phoenix px-4 py-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-white font-bold text-lg">Round {MOCK_ROUND}</h2>
            <p className="text-white/70 text-xs">
              {MOCK_IS_ACTIVE ? "Round in progress" : "Round not started"}
            </p>
          </div>
          <div className="text-right">
            <p className="text-white font-bold text-2xl">{MOCK_TOTAL_POINTS}</p>
            <p className="text-white/70 text-xs">total pts</p>
          </div>
        </div>
      </div>

      
      <div className="px-4 pt-3">
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold
            ${MOCK_IS_ACTIVE
              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
              : "bg-gray-100 text-gray-500 dark:bg-neutral-700 dark:text-neutral-400"
            }`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${MOCK_IS_ACTIVE ? "bg-green-500 animate-pulse" : "bg-gray-400"}`} />
          {MOCK_IS_ACTIVE ? "Live" : "Inactive"}
        </span>
      </div>

      <div className="px-4 pb-4 pt-3 flex flex-col gap-3">

        
        {captain ? (
          <div>
            <p className="text-xs text-gray-400 uppercase font-semibold mb-1 tracking-wide">
              Captain
            </p>
            <div className="flex items-center justify-between bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl px-3 py-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-[10px] font-bold shrink-0">
                  C
                </span>
                <div>
                  <p className="text-sm font-semibold">
                    {captain.firstName.charAt(0)}. {captain.lastName}
                  </p>
                  <p className="text-xs text-gray-400">#{captain.jerseyNumber}</p>
                </div>
              </div>
              <p className="font-bold text-phoenix text-sm">
                {captain.fantasyPoints} pts
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-red-50 dark:bg-red-900/10 border border-dashed border-red-300 dark:border-red-800 rounded-xl px-3 py-2">
            <p className="text-xs text-red-400 text-center">
              No captain selected — click C on a player
            </p>
          </div>
        )}

        
        <div>
          <p className="text-xs text-gray-400 uppercase font-semibold mb-1 tracking-wide">
            Starters
          </p>
          <div className="flex flex-col gap-1">
            {MOCK_STARTERS.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between px-3 py-1.5 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
              >
                <div className="flex items-center gap-2">
                  {p.id === captainId && (
                    <span className="w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center text-[8px] font-bold shrink-0">
                      C
                    </span>
                  )}
                  <p className="text-sm">
                    {p.firstName.charAt(0)}. {p.lastName}
                  </p>
                  <span className="text-xs text-gray-400">#{p.jerseyNumber}</span>
                </div>
                <p className="font-bold text-phoenix text-sm">{p.fantasyPoints} pts</p>
              </div>
            ))}
          </div>
        </div>

      
        <div>
          <p className="text-xs text-gray-400 uppercase font-semibold mb-1 tracking-wide">
            Coach
          </p>
          <div className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-neutral-200 dark:bg-neutral-700">
            <div className="flex items-center gap-2">
              <span className="text-xs bg-neutral-400 dark:bg-neutral-500 text-white px-1.5 py-0.5 rounded font-semibold">
                HC
              </span>
              <p className="text-sm">
                {MOCK_COACH.firstName.charAt(0)}. {MOCK_COACH.lastName}
              </p>
            </div>
            <p className="font-bold text-phoenix text-sm">{MOCK_COACH.fantasyPoints} pts</p>
          </div>
        </div>

        
        <div>
          <p className="text-xs text-gray-400 uppercase font-semibold mb-1 tracking-wide">
            Bench
          </p>
          <div className="flex flex-col gap-1">
            {MOCK_BENCH.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between px-3 py-1.5 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors opacity-70"
              >
                <div className="flex items-center gap-2">
                  <p className="text-sm">
                    {p.firstName.charAt(0)}. {p.lastName}
                  </p>
                  <span className="text-xs text-gray-400">#{p.jerseyNumber}</span>
                </div>
                <p className="font-bold text-gray-400 text-sm">{p.fantasyPoints} pts</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoundInfoPanel;