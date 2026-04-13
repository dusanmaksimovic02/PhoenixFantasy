import { createBrowserRouter } from "react-router-dom";
import Layout from "./Layout";
import Home from "../pages/Home";
import NotFound from "../pages/NotFound";
import Login from "../pages/Login";
import Profile from "../pages/Profile";
import { ProtectedLoader } from "./ProtectedLoader";
import GamePage from "../pages/GamePage";
import { LoginLoader } from "./LoginLoader";
import Chat from "../pages/Chat";
import StartGame from "../components/GamePage/StartGame";

import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "login",
        element: <Login />,
        loader: LoginLoader,
      },
      {
        path: "profile",
        element: <Profile />,
        loader: ProtectedLoader,
      },
      {
        path: "chat",
        element: <Chat />,
      },
      {
        path: "/game/:team1/vs/:team2",
        element: <GamePage />,
        loader: ProtectedLoader,
      },
      {
        path: "/startGame/:team1/vs/:team2",
        element: <StartGame />,
        loader: ProtectedLoader,
      },
    
      {
        path: "forgot-password",
        element: <ForgotPassword />,
      },
      {
        path: "reset-password",
        element: <ResetPassword />,
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);