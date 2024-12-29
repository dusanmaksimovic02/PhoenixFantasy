import Navbar from "./components/Navbar";
import { BrowserRouter, Route, Routes } from "react-router";
import NFRoutes from "./routes/NFRoutes";
import Footer from "./components/Footer";
import { ToastContainer } from "react-toastify";
import emailjs from "@emailjs/browser";

function App() {
  emailjs.init({
    publicKey: "H2xpeUK6xVAiQDh35",
  });

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
      <ToastContainer />
    </>
  );
}

export default App;
