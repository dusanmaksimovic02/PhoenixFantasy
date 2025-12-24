import { useNavigate } from "react-router-dom";
import homeStart from "../../assets/images/home-start.png";
import type { FC } from "react";

const HomeStart: FC = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/fantasy");
  };

  return (
    <div className="h-screen w-screen gap-10 pt-15 flex justify-center items-center">
      <div className="h-full w-[50%] flex flex-col justify-center pl-23 gap-2">
        <h1 className="text-7xl font-bold">
          Phoenix <span className="text-phoenix">Fantasy</span>
        </h1>
        <h2 className="text-6xl font-bold">
          <span className="text-phoenix">Draft</span> Basketball
        </h2>
        <h3 className="text-5xl font-bold">
          Compete and <span className="text-phoenix">Dominate</span>
        </h3>
        <p className="text-2xl">
          Create your team, play with friends, and rule the league!
        </p>
        <button
          className="btn bg-phoenix/80 hover:bg-phoenix hover:border-phoenix border-phoenix hover:border-4 hover:cursor-pointer shadow-inner drop-shadow w-80 h-15 rounded-2xl text-2xl mt-5 ml-10"
          onClick={handleClick}
        >
          Start Fantasy Draft
        </button>
      </div>
      <div className="h-full w-[50%] flex justify-center items-center">
        <img src={homeStart} alt="basketball" className="h-150 w-200" />
      </div>
    </div>
  );
};

export default HomeStart;
