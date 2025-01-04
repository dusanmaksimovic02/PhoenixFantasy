import { useLocation } from "react-router";
import { Player } from "../models/Player.model";

const PlayerPage = () => {
  //   const { player } = useParams();
  const location = useLocation();
  const player = location.state?.player as Player;

  return (
    <div className="h-screen w-screen flex flex-col justify-center items-center">
      <h1>{`${player.firstName} ${player.lastName}`}</h1>
      <p>ID: {player.id}</p>
      <p>Team: {player.team}</p>
      <p>Position: {player.position}</p>
      <p>Age: {player.age}</p>
      <p>Height: {player.height}</p>
      <p>Weight: {player.weight}</p>
      <p>Jersey Number: {player.jerseyNumber}</p>
    </div>
  );
};

export default PlayerPage;
