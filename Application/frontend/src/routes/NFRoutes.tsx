import { Route, Routes } from "react-router";
import NotFound from "../pages/NotFound";
import Home from "../pages/Home";
import Standing from "../pages/Standing";
import Statistics from "../pages/Statistics";
import Fantasy from "../pages/Fantasy";
import AllGames from "../pages/AllGames";
import TeamPage from "../pages/TeamPage";
import PlayerPage from "../pages/PlayerPage";
import Login from "../pages/Login";
import Register from "../pages/Register";

const NFRoutes = () => {
  return (
    <Routes>
      <Route path="/" index element={<Home />} />
      <Route path="/standing" index element={<Standing />} />
      <Route path="/statistics" index element={<Statistics />} />
      <Route path="/fantasy" index element={<Fantasy />} />
      <Route path="/all-games" index element={<AllGames />} />
      <Route path="/team/:teamName" index element={<TeamPage />} />
      <Route path="/team/:teamName/:player" index element={<PlayerPage />} />
      <Route path="/login" index element={<Login />} />
      <Route path="/register" index element={<Register />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default NFRoutes;
