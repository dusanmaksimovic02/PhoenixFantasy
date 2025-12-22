import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

const Layout = () => {
  const { pathname } = useLocation();

  const hideLayout =
    pathname.startsWith("/login") || pathname.startsWith("/register");

  return (
    <>
      {!hideLayout && <Navbar />}
      <main className="w-full h-full overflow-hidden dark:bg-custom-gray dark:text-white">
        <Outlet />
      </main>
      {!hideLayout && <Footer />}
    </>
  );
};

export default Layout;
