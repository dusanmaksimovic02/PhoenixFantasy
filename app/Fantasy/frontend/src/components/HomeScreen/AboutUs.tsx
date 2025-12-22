import logo from "../../assets/images/phoenixLogo.png";
export const AboutUs = () => {
  return (
    <div className="p-5 pt-10 flex gap-10 max-sm:flex-col max-sm:justify-center max-sm:items-center font-palanquin">
      <div className="basis-2/5 flex justify-center rounded-3xl shadow-inner drop-shadow p-5">
        <img src={logo} alt="Phoenix League Logo" className="" />
      </div>
      <div className="basis-3/5 ">
        <h1 className="text-phoenix font-extrabold text-4xl sm:pl-20">
          About <span className="text-black dark:text-white">Us</span>
        </h1>
        <br />
        <div className="h-[90%] flex justify-center w-full flex-col">
          <p className="font-semibold text-[20px] max-sm:pt-10  px-20">
            Phoenix League And Fantasy: A Legacy of Excellence Since 2010
          </p>
          <br />
          <p className="px-20 max-sm:px-5 leading-relaxed">
            Welcome to the Phoenix League, where passion meets competition!
            Established in 2010, the Phoenix League has been the heart of draft
            basketball for over a decade. What started as a local initiative has
            grown into one of the most prestigious and recognized leagues,
            connecting players and fans from all corners of the globe. Our
            mission has always been clear: to provide the ultimate basketball
            experience. With a focus on innovation and community, the Phoenix
            League brings together elite teams to compete in a spirit of
            camaraderie, sportsmanship, and unrelenting drive. Each season,
            players and fans alike create unforgettable memories, as the league
            sets new standards for excitement and professionalism. From the
            high-energy matches to the vibrant community of fans, the Phoenix
            League is more than just a competition—it’s a movement. Join us as
            we continue to inspire, unite, and dominate the world of draft
            basketball. Together, we rise—just like the Phoenix.
          </p>
        </div>
      </div>
    </div>
  );
};
