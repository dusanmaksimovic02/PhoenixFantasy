import JoinDraftLeagueSection from "../components/FantasyPage/JoinDraftLeagueSection";
import { type FC } from "react";
import { useNavigate } from "react-router-dom";
import CreateDraftLeagueSection from "../components/FantasyPage/CreateDraftLeagueSection";
import { useAuth } from "../context/auth/useAuth";
import YourDraftLeagues from "../components/FantasyPage/YourDraftLeagues";
const Fantasy: FC = () => {
  const navigate = useNavigate();

  const { isLoggedIn } = useAuth();

  return (
    <div className="max-sm:w-svw max-sm:h-fit h-fit min-h-screen w-screen max-sm:min-h-svh pt-15 flex-col">
      <div className="w-screen h-60 max-sm:h-40 gap-3 flex flex-col justify-center items-center text-phoenix/90">
        <h1>
          Welcome <span className="dark:text-white text-black">to</span> Draft
          Fantasy
        </h1>
        <h3 className="max-sm:px-10 text-center">
          Create <span className="dark:text-white text-black">or</span> join{" "}
          <span className="dark:text-white text-black">a</span> draft league{" "}
          <span className="dark:text-white text-black">and</span> compete{" "}
          <span className="dark:text-white text-black">with your</span> friends!
        </h3>
      </div>
      {isLoggedIn() ? (
        <div className="h-full p-5 flex max-sm:flex-col">
          <YourDraftLeagues />

          {/* <div className="w-[6%] max-sm:w-full max-sm:mt-10 p-3">
          <div className="w-0.5 h-full max-sm:h-0.5 max-sm:w-full bg-phoenix"></div>
        </div> */}
          <div className="w-[6%] opacity-40  uppercase flex justify-center items-center tracking-widest max-sm:w-full max-sm:h-full max-sm:my-10 max-sm:mt-14 text-2xl">
            OR
          </div>

          <div className="h-full w-[47%] max-sm:w-full flex flex-col text-center items-center justify-center">
            <h4 className="mb-10 mt-5">Create/Join Draft League</h4>
            <div className="h-full w-full  justify-center items-center flex flex-col">
              <CreateDraftLeagueSection />

              <JoinDraftLeagueSection />
            </div>
          </div>
        </div>
      ) : (
        <div className="flex  flex-col justify-center items-center h-full">
          <h2>Please Login first to start draft</h2>
          <button
            className="btn bg-phoenix/80 hover:bg-phoenix hover:border-phoenix border-phoenix hover:border-4 hover:cursor-pointer shadow-inner drop-shadow rounded-2xl text-3xl p-7 mt-5 max-sm:text-[1rem]"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
        </div>
      )}
    </div>
  );
};

export default Fantasy;
