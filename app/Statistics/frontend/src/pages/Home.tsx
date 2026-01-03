import type { FC } from "react";
import pozadina from "../assets/images/backgroundd.png";
import { useNavigate } from "react-router-dom";

const Home: FC = () => {
  const navigate = useNavigate();
  const handleSignInClick = () => {
    navigate("/login");
  };
  // const handleRegisterClick = () => {
  //   navigate("/register");
  // };

  return (
    <>
      <div>
        <div className="h-fit min-h-screen w-screen relative">
          <img src={pozadina} alt="slika" className="w-screen h-screen" />
          <div className="absolute inset-0 pt-14  bg-black/40">
            <div className="w-[40%] p-10 flex flex-col items-start h-full justify-center">
              <h1 className="text-phoenix">
                Phoenix <span className="text-white">Statistics</span>
              </h1>
              <p>
                Enter real-time statistics, track player performance, and record
                all the key moments of matches in one place.
              </p>
              <button
                className="btn bg-phoenix/80 hover:bg-phoenix hover:border-phoenix border-phoenix hover:border-4 hover:cursor-pointer shadow-inner drop-shadow w-50 h-15 rounded-3xl text-2xl mt-5  max-sm:text-[1rem] max-sm:w-45 max-sm:h-10 max-sm:mt-2 "
                onClick={handleSignInClick}
              >
                Sign in
              </button>
              {/* <button
                className="btn bg-transparent hover:border-phoenix border-phoenix hover:border-4 hover:cursor-pointer shadow-inner drop-shadow w-50 h-15 rounded-3xl text-2xl mt-5 max-sm:text-[1rem] max-sm:w-45 max-sm:h-10 max-sm:mt-2 "
                onClick={handleRegisterClick}
              >
                Register
              </button> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
