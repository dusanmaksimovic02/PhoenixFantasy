import type { FC } from "react";
import { FaArrowRight } from "react-icons/fa";

const Fantasy: FC = () => {
  const yourDraftLeagues: string[] = [
    "League 1",
    "League 2",
    "League 3",
    "League 4",
    "League 5",
  ];

  return (
    <div className="max-sm:w-svw max-sm:h-fit h-fit min-h-screen w-screen max-sm:min-h-svh pt-15 flex-col">
      <div className="w-screen h-60 max-sm:h-40 gap-3 flex flex-col justify-center items-center text-phoenix/90">
        <h1>
          Welcome <span className="text-white">to</span> Draft Fantasy
        </h1>
        <h3 className="max-sm:px-10 text-center">
          Create <span className="text-white">or</span> join{" "}
          <span className="text-white">a</span> draft league{" "}
          <span className="text-white">and</span> compete{" "}
          <span className="text-white">with your</span> friends!
        </h3>
      </div>
      <div className="h-full p-5 flex max-sm:flex-col">
        <div className="h-full w-[47%] max-sm:w-full flex text-center flex-col justify-center items-center">
          <h4 className="mb-10 mt-5">Your draft Leagues</h4>
          <div className="w-full h-full justify-center items-center  flex flex-col">
            {yourDraftLeagues.length > 0 ? (
              yourDraftLeagues.map((league) => (
                <button
                  className="btn bg-phoenix/80 hover:bg-phoenix hover:border-phoenix border-phoenix hover:border-4 hover:cursor-pointer shadow-inner drop-shadow min-w-50 max-w-full max-sm:max-w-svw overflow-auto w-fit h-fit min-h-15 rounded-2xl text-xl mt-5 p-3 max-sm:text-[1.1rem] max-sm:min-w-45 max-sm:mt-5 flex justify-between items-center "
                  key={league}
                >
                  {league}
                  <FaArrowRight />
                </button>
              ))
            ) : (
              <h5>You haven’t joined any leagues yet 😔</h5>
            )}
          </div>
        </div>
        {/* <div className="w-[6%] max-sm:w-full max-sm:mt-10 p-3">
          <div className="w-0.5 h-full max-sm:h-0.5 max-sm:w-full bg-phoenix"></div>
        </div> */}
        <div className="w-[6%] opacity-40  uppercase flex justify-center items-center tracking-widest max-sm:w-full max-sm:h-full max-sm:my-10 max-sm:mt-14 text-2xl">
          OR
        </div>

        <div className="h-full w-[47%] max-sm:w-full flex flex-col text-center items-center justify-center">
          <h4 className="mb-10 mt-5">Create/Join Draft League</h4>
          <div className="h-full w-full  justify-center items-center flex flex-col">
            <button className="btn bg-phoenix/80 hover:bg-phoenix hover:border-phoenix border-phoenix hover:border-4 hover:cursor-pointer shadow-inner drop-shadow min-w-60 h-15 rounded-2xl text-xl mt-5 p-3 max-sm:text-[1.1rem] max-sm:min-w-45 max-sm:mt-5">
              Create Draft League
            </button>
            <button className="btn hover:border-phoenix border-phoenix hover:border-4 hover:cursor-pointer shadow-inner drop-shadow min-w-60 h-15 rounded-2xl text-xl mt-5 p-3 max-sm:text-[1.1rem] max-sm:min-w-45  max-sm:mt-5">
              Join Draft League
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Fantasy;
