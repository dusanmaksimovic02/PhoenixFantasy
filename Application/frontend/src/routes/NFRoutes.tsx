import { Route, Routes } from "react-router";
import NotFound from "../pages/NotFound";
import Home from "../pages/Home";
import Standing from "../pages/Standing";
import Statistics from "../pages/Statistics";
import Fantasy from "../pages/Fantasy";

const NFRoutes = () => {
  return (
    <Routes>
      <Route path="/" index element={<Home />} />
      <Route path="/standing" index element={<Standing />} />
      <Route path="/statistics" index element={<Statistics />} />
      <Route path="/fantasy" index element={<Fantasy />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default NFRoutes;
