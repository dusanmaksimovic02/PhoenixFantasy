import { AboutUs } from "../components/HomeScreen/AboutUs";
import { HomeStart } from "../components/HomeScreen/HomeStart";
import Rounds from "../components/HomeScreen/Rounds";
import RulesAndRewards from "../components/HomeScreen/RulesAndRewards";
import TopPlayer from "../components/HomeScreen/TopPlayer";

const Home = () => {
  return (
    <>
      <HomeStart />
      <Rounds />
      <section id="about-us" className="pt-[3.5rem]">
        <AboutUs />
      </section>
      <section id="rules-and-rewards" className="pt-[3.5rem]">
        <RulesAndRewards />
      </section>
      <section id="top-players" className="pt-[3.5rem]">
        <TopPlayer />
      </section>
    </>
  );
};

export default Home;
