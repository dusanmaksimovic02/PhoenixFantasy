import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { useEffect } from "react";
import emailjs from "@emailjs/browser";
import { ThemeProvider } from "./theme-provider";

const App = () => {
  useEffect(() => {
    emailjs.init({
      publicKey: "H2xpeUK6xVAiQDh35",
    });
  }, []);

  return (
    <>
      <ThemeProvider defaultTheme="light" storageKey="theme-mode">
        <RouterProvider router={router} />
      </ThemeProvider>
    </>
  );
};

export default App;
