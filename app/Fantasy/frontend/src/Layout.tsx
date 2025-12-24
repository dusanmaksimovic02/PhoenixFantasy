import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { AnimatePresence } from "framer-motion";
import ScrollToTop from "./components/ScrollToTop";

const Layout = () => {
  const { pathname } = useLocation();

  const hideLayout =
    pathname.startsWith("/login") || pathname.startsWith("/register");

  return (
    <>
      {!hideLayout && <Navbar />}
      <AnimatePresence mode="wait">
        <main className="w-full h-full overflow-hidden dark:bg-custom-gray dark:text-white">
          <ScrollToTop />
          <Outlet />
        </main>
      </AnimatePresence>
      {!hideLayout && <Footer />}
    </>
  );
};

export default Layout;
