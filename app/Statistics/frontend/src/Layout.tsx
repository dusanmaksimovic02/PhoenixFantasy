import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { AnimatePresence } from "framer-motion";
import ScrollToTop from "./components/ScrollToTop";

const Layout = () => {
  return (
    <>
      <Navbar />
      <AnimatePresence mode="wait">
        <main className="w-full h-full overflow-hidden dark:bg-custom-gray dark:text-white">
          <ScrollToTop />
          <Outlet />
        </main>
      </AnimatePresence>
      <Footer />
    </>
  );
};

export default Layout;
