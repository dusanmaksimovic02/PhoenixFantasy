import { NavLink, useLocation, useNavigate } from "react-router";
import { IoMenu } from "react-icons/io5";
import { useEffect, useState } from "react";
import { GoSun } from "react-icons/go";
import { PiMoonLight } from "react-icons/pi";
import { CgProfile } from "react-icons/cg";
import { IoClose } from "react-icons/io5";
import { Button } from "@material-tailwind/react";

type NavLinkType = {
  name: string;
  to: string;
  isSection?: boolean;
};

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("dark-mode");
    return savedTheme === "true";
  });

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleToggle = () => {
    setIsDarkMode((prevMode) => {
      const newMode = !prevMode;
      localStorage.setItem("dark-mode", newMode.toString());
      return newMode;
    });
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const navLinks: NavLinkType[] = [
    {
      name: "Home",
      to: "/",
    },
    {
      name: "About Us",
      to: "about-us",
      isSection: true,
    },
    {
      name: "Rules and Rewards",
      to: "rules-and-rewards",
      isSection: true,
    },
    {
      name: "Standing",
      to: "/standing",
    },
    {
      name: "Statistics",
      to: "/statistics",
    },
    {
      name: "Fantasy",
      to: "/fantasy",
    },
  ];

  const isOnHomePage = location.pathname === "/";

  const handleScroll = (id: string, isOnHomePage: boolean): void => {
    if (!isOnHomePage) {
      navigate("/");
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  useEffect(() => {
    if (isDarkMode) {
      document.body.querySelector("#root")?.classList.add("dark");
    } else {
      document.body.querySelector("#root")?.classList.remove("dark");
    }
  }, [isDarkMode]);

  return (
    <>
      <header className="fixed z-10 text-white w-full h-16  bg-phoenix flex">
        <nav className="font-palanquin w-full flex justify-between items-center">
          <NavLink
            to="/"
            className="ml-3 w-20 h-10 bg-cover bg-no-repeat bg-[url('assets/images/logo.png')]"
          />
          <div className="max-lg:hidden justify-self-center">
            <ul className="flex gap-5">
              {navLinks.map(({ name, to, isSection }, index) => (
                <li key={index}>
                  {isSection ? (
                    <span
                      onClick={() => handleScroll(to, isOnHomePage)}
                      className="cursor-pointer text-white dark:text-black text-opacity-50 dark:text-opacity-50"
                    >
                      {name}
                    </span>
                  ) : (
                    <NavLink
                      to={to}
                      className={({ isActive }) =>
                        isActive
                          ? "text-white dark:text-black"
                          : "text-white dark:text-black text-opacity-50 dark:text-opacity-50 hover:text-opacity-100"
                      }
                    >
                      {name}
                    </NavLink>
                  )}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex gap-2">
            <Button
              className="flex border-2 rounded-full p-1 px-4 gap-2 justify-center items-center cursor-pointer dark:text-black  max-lg:mr-20 bg-transparent hover:bg-transparent border-white dark:border-black hover:border-black dark:hover:border-white"
              onClick={() => {
                navigate("/login");
              }}
            >
              <CgProfile className="w-6 h-6" />
              <span>Login</span>
            </Button>

            <div className="max-lg:hidden">
              <input
                type="checkbox"
                id="dark-mode-toggle"
                className="w-0 h-0 hidden peer"
                onChange={handleToggle}
                checked={isDarkMode} 
              />
              <label
                htmlFor="dark-mode-toggle"
                className="w-[80px] h-[40px] relative block bg-[#ebebeb] rounded-full shadow-label cursor-pointer transition-[0.3s] after:w-[30px] after:h-[30px] after:absolute after:top-[5px] after:left-[5px] after:bg-gradient-to-b after:from-[#ffcc89] after:to-[#d8860b] after:rounded-[180px] after:shadow-afterLabel after:transition-[0.3s] peer-checked:bg-[#242424] active:after:w-[40px] peer-checked:after:left-[75px] peer-checked:after:translate-x-[-100%]
              peer-checked:after:bg-gradient-to-b peer-checked:after:from-[#777] peed-checked:after:to-[#3a3a3a] mr-3 max-sm:mr-20"
              >
                <GoSun
                  className={`absolute w-[25px] h-[25px] top-[8px] z-[100] left-[7px] transition-[0.3s] ${
                    isDarkMode ? "fill-[#7e7e7e]" : "fill-white"
                  }`}
                />

                <PiMoonLight
                  className={`absolute w-[25px] h-[25px] top-[8px] z-[100] left-[48px] transition-[0.3s] ${
                    isDarkMode ? "fill-[#fff]" : "fill-[#7e7e7e]"
                  }`}
                />
              </label>
            </div>
          </div>
          <IoMenu
            className="lg:hidden cursor-pointer dark:text-black h-16 w-16 mr-3 absolute hover:text-opacity-70 right-0"
            onClick={() => {
              toggleMenu();
            }}
          />
          {isMenuOpen && (
            <>
              <div className="absolute top-0 w-full h-screen bg-phoenix flex flex-col items-center justify-center gap-5 z-200">
                <IoClose
                  className="cursor-pointer text-white dark:text-black h-8 w-8 absolute top-5 right-5"
                  onClick={toggleMenu}
                />
                <ul className="text-white flex flex-col gap-5 text-center text-2xl">
                  {navLinks.map(({ name, to, isSection }, index) => (
                    <li
                      key={index}
                      onClick={() => {
                        toggleMenu();
                      }}
                    >
                      {isSection ? (
                        <span
                          onClick={() => handleScroll(to, isOnHomePage)}
                          className="cursor-pointer text-white dark:text-black text-opacity-50 dark:text-opacity-50"
                        >
                          {name}
                        </span>
                      ) : (
                        <NavLink
                          to={to}
                          className={({ isActive }) =>
                            isActive
                              ? "text-white dark:text-black"
                              : "text-white dark:text-black text-opacity-50 dark:text-opacity-50 hover:text-opacity-100"
                          }
                        >
                          {name}
                        </NavLink>
                      )}
                    </li>
                  ))}
                </ul>
                <div className="flex gap-2 w-full justify-center">
                  <input
                    type="checkbox"
                    id="dark-mode-toggle"
                    className="w-0 h-0 hidden peer"
                    onChange={handleToggle}
                    checked={isDarkMode}
                  />
                  <label
                    htmlFor="dark-mode-toggle"
                    className="ml-[4.5rem] w-[80px] h-[40px] relative block bg-[#ebebeb] rounded-full shadow-label cursor-pointer transition-[0.3s] after:w-[30px] after:h-[30px] after:absolute after:top-[5px] after:left-[5px] after:bg-gradient-to-b after:from-[#ffcc89] after:to-[#d8860b] after:rounded-[180px] after:shadow-afterLabel after:transition-[0.3s] peer-checked:bg-[#242424] active:after:w-[40px] peer-checked:after:left-[75px] peer-checked:after:translate-x-[-100%]
              peer-checked:after:bg-gradient-to-b peer-checked:after:from-[#777] peed-checked:after:to-[#3a3a3a] mr-3 max-lg:mr-20"
                  >
                    <GoSun
                      className={`absolute w-[25px] h-[25px] top-[8px] z-[100] left-[7px] transition-[0.3s] ${
                        isDarkMode ? "fill-[#7e7e7e]" : "fill-white"
                      }`}
                    />

                    <PiMoonLight
                      className={`absolute w-[25px] h-[25px] top-[8px] z-[100] left-[48px] transition-[0.3s] ${
                        isDarkMode ? "fill-[#fff]" : "fill-[#7e7e7e]"
                      }`}
                    />
                  </label>
                </div>
              </div>
            </>
          )}
        </nav>
      </header>
    </>
  );
};

export default Navbar;
