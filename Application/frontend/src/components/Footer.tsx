import { useEffect, useState } from "react";
import { BsCCircle } from "react-icons/bs";
import { FaFacebookSquare, FaLinkedin } from "react-icons/fa";
import { FaSquareInstagram, FaSquareXTwitter } from "react-icons/fa6";
import { IoIosSend } from "react-icons/io";
import { NavLink } from "react-router";
import emailjs from "@emailjs/browser";
import { toast } from "react-toastify";

const Footer = () => {
  const targetDate = new Date("2025-01-01T00:00:00").getTime();
  const [timeLeft, setTimeLeft] = useState<string>("");
  const links = [
    {
      name: "Home",
      to: "/",
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

  const [opinion, setOpinion] = useState("");

  const sendEmail = (e: React.FormEvent) => {
    e.preventDefault();

    if (!opinion) {
      toast.info("Please enter your opinion before submitting!");
      return;
    }

    const templateParams = {
      message: opinion,
      mail: "customer@gmail.com",
    };

    emailjs.send("service_hotfwkr", "template_rczwn1v", templateParams).then(
      (response) => {
        if (response.status === 200) {
          toast.success("Your opinion has been sent successfully!");
          setOpinion("");
        }
      },
      (err) => {
        console.error("FAILED...", err);
        toast.error("Something went wrong. Please try again!");
      }
    );
  };

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance <= 0) {
        setTimeLeft("Event has started!");
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
    };

    calculateTimeLeft();
    const intervalId = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(intervalId);
  }, [targetDate]);

  return (
    <footer className="w-[100] h-fit p-5 pt-10 grid bg-[#212529]  overflow-hidden text-white text-center">
      <div className="flex flex-wrap w-full gap-5">
        <div className="flex-grow flex-shrink">
          <h1 className="font-extrabold text-2xl text-phoenix">Contact us</h1>

          <br />

          <p className="font-semibold text-[18px]">Customer Support: </p>
          <p className="text-white">9 AM - 6 PM (Mon- Fri)</p>

          <p className="text-white">
            <span className="font-semibold text-[18px]">Call us: </span>+1 234
            567 890
          </p>

          <br />

          <div className="flex gap-2 w-full h-7 p-2">
            <FaSquareInstagram
              className="flex-grow flex-shrink h-8 w-8 cursor-pointer"
              onClick={() => window.open("https://www.instagram.com/")}
            />
            <FaFacebookSquare
              className="flex-grow flex-shrink h-8 w-8 cursor-pointer"
              onClick={() => window.open("https://www.facebook.com/")}
            />
            <FaSquareXTwitter
              className="flex-grow flex-shrink h-8 w-8 cursor-pointer"
              onClick={() => window.open("https://www.twitter.com/")}
            />
            <FaLinkedin
              className="flex-grow flex-shrink h-8 w-8 cursor-pointer"
              onClick={() => window.open("https://www.linkedin.com/")}
            />
          </div>
        </div>
        <div className="text-center flex-grow flex-shrink">
          <h1 className="font-extrabold text-2xl text-phoenix">Next round</h1>

          <br />

          <p id="countdown" className="text-white font-bold text-lg">
            {timeLeft}
          </p>
        </div>
        <div className="flex-grow flex-shrink">
          <h1 className="font-extrabold text-2xl text-phoenix">Phoenix</h1>

          <br />

          <ul className="flex gap-2 flex-col text-center">
            {links.map(({ name, to }, index) => (
              <li key={index}>
                <NavLink
                  to={to}
                  className={({ isActive }) =>
                    isActive
                      ? "text-white "
                      : "text-white text-opacity-50  hover:text-opacity-100 hover:underline"
                  }
                >
                  {name}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex-grow flex-shrink flex flex-col">
          <h1 className="font-extrabold text-2xl text-phoenix">
            Tell us how to improve
          </h1>
          <br />
          <div className="w-full flex ">
            <input
              type="text"
              placeholder="Write your opinion..."
              className="rounded m-3 h-7 text-black flex-grow flex-shrink"
              value={opinion}
              onChange={(e) => setOpinion(e.target.value)}
            />
            <button type="submit" className="text-phoenix " onClick={sendEmail}>
              <IoIosSend className="w-7 h-7" />
            </button>
          </div>
          <br />
          <button
            className="w-fit text-black bg-white shadow-inner drop-shadow px-4 py-2 h-fit rounded mt-4 hover:bg-opacity-80 justify-self-end self-end"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            Back to Top
          </button>
        </div>
      </div>
      <div className="w-full text-center pt-5 justify-self-end self-end max-sm:text-[13px]">
        <hr />
        <p className=" flex justify-center items-center gap-2 py-2">
          Phoenix
          <BsCCircle />
          by DSV Solution. All right reserved. {new Date().getFullYear()}.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
