import Navbar from "./components/Navbar";
import { BrowserRouter, Route, Routes } from "react-router";
import NFRoutes from "./routes/NFRoutes";
import Footer from "./components/Footer";

function App() {
  return (
    <>
      <BrowserRouter>
        <div className="w-full h-full overflow-hidden dark:bg-[#212529] dark:text-white">
          <Navbar />
          <main className="w-full h-full">
            <Routes>
              <Route path="*" element={<NFRoutes />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </>
  );
}

export default App;
