import type { FC } from "react";
import GameCard from "./GameCard";

export type Team = {
  name: string;
  logo: string;
};

export type Matchup = {
  team1: Team;
  team2: Team;
  date: string;
};

const YourMatches: FC = () => {
  const rounds: Matchup[] = [
    {
      team1: {
        name: "Team A",
        logo: "https://media-cdn.incrowdsports.com/2681304e-77dd-4331-88b1-683078c0fb49.png?width=90&height=90&resizeType=fill&format=webp",
      },
      team2: {
        name: "Team H",
        logo: "https://media-cdn.incrowdsports.com/2681304e-77dd-4331-88b1-683078c0fb49.png?width=90&height=90&resizeType=fill&format=webp",
      },
      date: "2024-12-30 18:00",
    },
    {
      team1: {
        name: "Team B",
        logo: "https://media-cdn.incrowdsports.com/2681304e-77dd-4331-88b1-683078c0fb49.png?width=90&height=90&resizeType=fill&format=webp",
      },
      team2: {
        name: "Team G",
        logo: "https://media-cdn.incrowdsports.com/2681304e-77dd-4331-88b1-683078c0fb49.png?width=90&height=90&resizeType=fill&format=webp",
      },
      date: "2024-12-30 20:00",
    },
    {
      team1: {
        name: "Team C",
        logo: "https://media-cdn.incrowdsports.com/2681304e-77dd-4331-88b1-683078c0fb49.png?width=90&height=90&resizeType=fill&format=webp",
      },
      team2: {
        name: "Team F",
        logo: "https://media-cdn.incrowdsports.com/2681304e-77dd-4331-88b1-683078c0fb49.png?width=90&height=90&resizeType=fill&format=webp",
      },
      date: "2024-12-31 18:00",
    },
    {
      team1: {
        name: "Team D",
        logo: "https://media-cdn.incrowdsports.com/2681304e-77dd-4331-88b1-683078c0fb49.png?width=90&height=90&resizeType=fill&format=webp",
      },
      team2: {
        name: "Team E",
        logo: "https://media-cdn.incrowdsports.com/2681304e-77dd-4331-88b1-683078c0fb49.png?width=90&height=90&resizeType=fill&format=webp",
      },
      date: "2024-12-31 20:00",
    },
  ];

  return (
    <>
      <div className="flex gap-5 justify-center items-center flex-wrap p-5 py-8 ">
        {rounds.map((game, index) => (
          <GameCard key={index} matchup={game}></GameCard>
        ))}
      </div>
    </>
  );
};

export default YourMatches;
