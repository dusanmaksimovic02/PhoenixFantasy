import { useEffect, type FC } from "react";
import { AboutUs } from "../components/HomeScreen/AboutUs";
import HomeStart from "../components/HomeScreen/HomeStart";
import Rounds from "../components/HomeScreen/Rounds";
import RulesAndRewards from "../components/HomeScreen/RulesAndRewards";
import TopPlayer from "../components/HomeScreen/TopPlayer";
import { useLocation } from "react-router-dom";

const Home: FC = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const element = document.getElementById(location.hash.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }, [location.hash]);
  
  return (
    <>
      <HomeStart />
      <Rounds />
      <section id="about-us" className="pt-14">
        <AboutUs />
      </section>
      <section id="rules-and-rewards" className="pt-14">
        <RulesAndRewards />
      </section>
      <section id="top-players" className="pt-14">
        <TopPlayer />
      </section>
      <div className="h-20"></div>
    </>
  );
};

export default Home;
