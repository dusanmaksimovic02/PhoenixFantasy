// src/App.tsx
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { useEffect } from "react";
import emailjs from "@emailjs/browser";
import { ToastContainer } from "react-toastify";

const App = () => {
  useEffect(() => {
    emailjs.init({
      publicKey: "H2xpeUK6xVAiQDh35",
    });
  }, []);

  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer />
    </>
  );
};

export default App;
