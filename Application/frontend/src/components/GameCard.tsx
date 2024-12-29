import { Matchup } from "../pages/Home";

type Props = {
  matchup: Matchup;
};

const GameCard = (props: Props) => {
  return (
    <div className="flex flex-col justify-center items-center gap-2 px-12 p-5 bg-phoenix rounded-2xl shadow-inner drop-shadow text-white dark:text-black font-palanquin">
      <div className="flex justify-center items-center gap-3 max-sm:w-[150px]">
        <img
          src={props.matchup.team1.logo}
          alt={`${props.matchup.team1.name} logo`}
          className="w-10 rounded-full"
        />
        <span className="text-2xl font-semibold max-sm:text-[17px]">
          {props.matchup.team1.name}
        </span>
      </div>

      <p>{props.matchup.date}</p>

      <div className="flex justify-center items-center gap-3 max-sm:w-[150px]">
        <img
          src={props.matchup.team2.logo}
          alt={`${props.matchup.team2.name} logo`}
          className="w-10 rounded-full"
        />
        <span className="text-2xl font-semibold max-sm:text-[17px]">
          {props.matchup.team2.name}
        </span>
      </div>
    </div>
  );
};

export default GameCard;
