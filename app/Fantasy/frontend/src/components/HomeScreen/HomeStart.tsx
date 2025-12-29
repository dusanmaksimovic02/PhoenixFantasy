import { useNavigate } from "react-router-dom";
import homeStart from "../../assets/images/home.png";
import ball from "../../assets/images/ball.png";
import type { FC } from "react";
import { motion } from "framer-motion";

const HomeStart: FC = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/fantasy");
  };

  return (
    <div className="h-screen w-screen gap-10 pt-15 flex justify-center items-center max-sm:flex-col max-sm:h-svh max-sm:w-svw max-sm:pt-47 max-sm:gap-0">
      <div className="h-full w-[50%] flex flex-col justify-center pl-23 max-sm:pl-0 gap-2 max-sm:justify-center max-sm:items-center max-sm:h-svh max-sm:w-svw text-nowrap">
        <h1 className="text-7xl font-bold max-sm:text-[2.5rem] max-xl:text-5xl max-lg:text-3xl">
          Phoenix <span className="text-phoenix">Fantasy</span>
        </h1>
        <h2 className="text-6xl font-bold max-sm:text-[2rem] max-xl:text-4xl max-lg:text-2xl">
          <span className="text-phoenix">Draft</span> Basketball
        </h2>
        <h3 className="text-5xl font-bold max-sm:text-[1.5rem] max-xl:text-3xl max-lg:text-xl">
          Compete and <span className="text-phoenix">Dominate</span>
        </h3>
        <p className="text-2xl max-sm:text-[0.8rem] max-xl:text-lg max-lg:text-[0.9rem]">
          Create your team, play with friends, and rule the league!
        </p>
        <button
          className="btn bg-phoenix/80 hover:bg-phoenix hover:border-phoenix border-phoenix hover:border-4 hover:cursor-pointer shadow-inner drop-shadow w-80 h-15 rounded-2xl text-2xl mt-5 ml-10 max-sm:text-[1rem] max-sm:w-45 max-sm:h-10 max-sm:mt-2 max-sm:ml-0"
          onClick={handleClick}
        >
          Start Fantasy Draft
        </button>
      </div>
      <div className="relative h-full w-[50%] pt-15 flex flex-col justify-center items-center max-sm:pt-0  max-sm:w-svw max-sm:p-7 ">
        {/* <img src={homeStart} alt="basketball" className="h-150 w-200" /> */}
        <img
          src={homeStart}
          alt="basketball hoop"
          className="w-150 h-110 pt-15 z-1 max-sm:w-80 max-sm:h-75 max-xl:w-120 max-xl:h-90 max-lg:w-100 max-lg:h-80"
        />
        <motion.img
          src={ball}
          alt="basketball ball"
          className="-translate-y-30 w-100 h-90 max-sm:w-50 max-sm:h-60 max-xl:w-80 max-xl:h-70 max-lg:w-65 max-lg:h-60"
          initial={{
            y: -600,
            scale: 1,
            opacity: 0,
          }}
          animate={{
            y: 40,
            scale: 1,
            opacity: 1,
          }}
          transition={{
            duration: 1.5,
            ease: "easeIn",
          }}
        />
      </div>
    </div>
  );
};

export default HomeStart;
