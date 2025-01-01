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
      <AboutUs />
      <RulesAndRewards />
      <TopPlayer />
    </>
  );
};

export default Home;
