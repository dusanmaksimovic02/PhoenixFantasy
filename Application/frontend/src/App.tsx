import Navbar from "./components/Navbar";
import { BrowserRouter, Route, Routes, useLocation } from "react-router";
import NFRoutes from "./routes/NFRoutes";
import Footer from "./components/Footer";
import { ToastContainer } from "react-toastify";
import emailjs from "@emailjs/browser";
import { AnimatePresence } from "framer-motion";

function App() {
  emailjs.init({
    publicKey: "H2xpeUK6xVAiQDh35",
  });


  return (
    <BrowserRouter>
      <div className="w-full h-full overflow-hidden dark:bg-[#212529] dark:text-white">
        <AppContent />
      </div>
      <ToastContainer />
    </BrowserRouter>
  );
}

function AppContent() {
  const location = useLocation();

  const hideLayoutPaths = ["/login", "/register"];

  const shouldHideLayout = hideLayoutPaths.includes(location.pathname);

  return (
    <>
      {!shouldHideLayout && <Navbar />}
      <main className="w-full h-full">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="*" element={<NFRoutes />} />
          </Routes>
        </AnimatePresence>
      </main>
      {!shouldHideLayout && <Footer />}
    </>
  );
}

export default App;