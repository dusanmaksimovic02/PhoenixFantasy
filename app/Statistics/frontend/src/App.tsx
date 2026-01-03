import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { ThemeProvider } from "./theme-provider";

const App = () => {
  return (
    <>
      <ThemeProvider defaultTheme="light" storageKey="theme-mode">
        <RouterProvider router={router} />
      </ThemeProvider>
    </>
  );
};

export default App;
