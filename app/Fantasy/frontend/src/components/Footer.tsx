import { useEffect, useState, type FC } from "react";
import { BsCCircle } from "react-icons/bs";
import { FaAngleDoubleUp, FaFacebookSquare, FaLinkedin } from "react-icons/fa";
import { FaSquareInstagram, FaSquareXTwitter } from "react-icons/fa6";
import { IoIosSend } from "react-icons/io";
import { NavLink } from "react-router-dom";
import emailjs from "@emailjs/browser";
import { toast } from "react-toastify";
import CountdownBox from "./CountdownBox";

const Footer: FC = () => {
  const targetDate = new Date("2026-01-27T00:00:00").getTime();
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  

  const [isLive, setIsLive] = useState(false);
  const [blink, setBlink] = useState(false);

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
        if (response && response.status === 200) {
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
      const now = Date.now();
      const distance = targetDate - now;

      if (distance <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        setIsLive(true);
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  useEffect(() => {
    if (timeLeft.days === 0 && timeLeft.hours === 0 && !isLive) {
      const blinkInterval = setInterval(() => {
        setBlink((prev) => !prev);
      }, 500);

      return () => clearInterval(blinkInterval);
    }
  }, [timeLeft, isLive]);

  return (
    <footer className="w-full h-fit p-5 pt-10 grid dark:bg-custom-gray  overflow-hidden  text-center">
      <div className="flex flex-wrap w-full gap-5">
        <div className="grow shrink">
          <h1 className="font-extrabold text-2xl text-phoenix">Contact us</h1>

          <br />

          <p className="font-semibold text-[18px]">Customer Support: </p>
          <p className="pt-2">9 AM - 6 PM (Mon- Fri)</p>

          <p
            className=" cursor-pointer pt-2"
            onClick={() => {
              window.location.href = "tel:+1 234 567 890";
            }}
          >
            <a className="font-semibold text-[18px] ">Call us: </a>+1 234 567
            890
          </p>

          <p
            className="cursor-pointer pt-2"
            onClick={() => {
              window.location.href =
                "mailto:phoenix@support.com?subject=Support Request&body=Hello Phoenix Support,";
            }}
          >
            <a className="font-semibold text-[18px]">Mail: </a>
            phoenix@support.com
          </p>

          <br />

          <div className="flex gap-2 w-full h-7 p-2">
            <FaSquareInstagram
              className="grow shrink h-8 w-8 cursor-pointer"
              onClick={() => window.open("https://www.instagram.com/")}
            />
            <FaFacebookSquare
              className="grow shrink h-8 w-8 cursor-pointer"
              onClick={() => window.open("https://www.facebook.com/")}
            />
            <FaSquareXTwitter
              className="grow shrink h-8 w-8 cursor-pointer"
              onClick={() => window.open("https://www.twitter.com/")}
            />
            <FaLinkedin
              className="grow shrink h-8 w-8 cursor-pointer"
              onClick={() => window.open("https://www.linkedin.com/")}
            />
          </div>
        </div>
        <div className="text-center grow shrink">
          <div className="text-center grow shrink">
            <h1 className="font-extrabold text-2xl text-phoenix mb-4">
              Next round
            </h1>

            {isLive ? (
              <div className="flex justify-center">
                <span
                  className="px-6 py-3 text-xl font-extrabold rounded-full 
        bg-red-600 text-white animate-pulse shadow-lg"
                >
                  🔴 LIVE
                </span>
              </div>
            ) : (
              <div className="grid grid-flow-col gap-6 auto-cols-max justify-center">
                <CountdownBox label="days" value={timeLeft.days} />
                <CountdownBox label="hours" value={timeLeft.hours} />
                <CountdownBox
                  label="min"
                  value={timeLeft.minutes}
                  blink={
                    timeLeft.days === 0 && timeLeft.hours === 0 ? blink : false
                  }
                />
                <CountdownBox
                  label="sec"
                  value={timeLeft.seconds}
                  blink={
                    timeLeft.days === 0 && timeLeft.hours === 0 ? blink : false
                  }
                />
              </div>
            )}
          </div>
        </div>
        <div className="grow shrink">
          <h1 className="font-extrabold text-2xl text-phoenix">Phoenix</h1>

          <br />

          <ul className="flex gap-2 flex-col text-center">
            {links.map(({ name, to }, index) => (
              <li className="list-none" key={index}>
                <NavLink
                  to={to}
                  className={({ isActive }) =>
                    isActive
                      ? ""
                      : "text-black/50 hover:text-black dark:text-white/50 hover:dark:text-white"
                  }
                >
                  {name}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        <div className="grow shrink flex flex-col">
          <h1 className="font-extrabold text-2xl text-phoenix">
            Tell us how to improve
          </h1>
          <br />
          <div className="w-full flex ">
            <input
              type="text"
              placeholder="Write your opinion..."
              className="rounded m-3 h-7 text-black bg-white p-2 border-2 border-phoenix grow shrink"
              value={opinion}
              onChange={(e) => setOpinion(e.target.value)}
            />
            <button
              type="submit"
              className="text-phoenix cursor-pointer"
              onClick={sendEmail}
            >
              <IoIosSend className="w-7 h-7" />
            </button>
          </div>
          <br />
          <button
            className="w-fit text-black flex justify-center items-center cursor-pointer gap-2 bg-phoenix shadow-inner drop-shadow px-4 py-2 h-fit rounded-md mt-4 hover:bg-opacity-80 justify-self-end self-end"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            Back to Top <FaAngleDoubleUp />
          </button>
        </div>
      </div>
      <div className="w-full text-center pt-10 justify-self-end self-end max-sm:text-[13px]">
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
