import { createBrowserRouter } from "react-router-dom";
import Layout from "./Layout";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import Fantasy from "./pages/Fantasy";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Standing from "./pages/Standing";
import ProfilePage from "./pages/ProfilePage";
import Statistics from "./pages/Statistics";
import AllGames from "./pages/AllGames";
import TeamPage from "./pages/TeamPage";
import PlayerPage from "./pages/PlayerPage";
import GamePage from "./pages/GamePage";
import CreateDraftLeague from "./pages/CreateDraftLeague";
import FantasyLayout from "./components/FantasyPage/FantasyLayout";
import DraftLeague from "./pages/DraftLeague";

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "fantasy",
        element: <FantasyLayout />,
        children: [
          {
            element: <Fantasy />,
            index: true,
          },
          {
            element: <CreateDraftLeague />,
            path: "draft/:leagueName/:code",
          },
          {
            element: <DraftLeague />,
            path: "draft/:leagueName",
          },
        ],
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "standing",
        element: <Standing />,
      },
      {
        path: "profile",
        element: <ProfilePage />,
      },
      {
        path: "statistics",
        element: <Statistics />,
      },
      {
        path: "all-games",
        element: <AllGames />,
      },
      {
        path: "/team/:teamName",
        element: <TeamPage />,
      },
      {
        path: "/team/:teamName/:player",
        element: <PlayerPage />,
      },
      {
        path: "/game/:team1/vs/:team2",
        element: <GamePage />,
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);
