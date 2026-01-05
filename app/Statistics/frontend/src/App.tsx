import { RouterProvider } from "react-router-dom";
import { router } from "./routes/router";
import { ThemeProvider } from "./context/theme/theme-provider";

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
