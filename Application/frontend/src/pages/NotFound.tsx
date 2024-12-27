import { NavLink } from "react-router";

const NotFound = () => {
  return (
    <div className="w-full h-[100vh] relative flex flex-col justify-center items-center bg-cover bg-[url('assets/images/background.jpg')]">
      <div className="bg-opacity-75 bg-black p-5 border-2 rounded-2xl ">
        <h1 className="text-4xl font-bold text-white">
          ERROR 404: <span className="text-phoenix">Page Not Found</span>
        </h1>
        <p className="text-white text-center">
          Sorry, the page you are looking for could not be found.
        </p>
      </div>
      <br />
      <NavLink to="/" className="bg-opacity-75 bg-black text-white border-2 p-3 font-semibold rounded-[20px]">
        Go home
      </NavLink>
    </div>
  );
};

export default NotFound;
