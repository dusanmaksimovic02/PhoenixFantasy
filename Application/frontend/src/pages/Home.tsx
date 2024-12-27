const Home = () => {
  return (
    <>
      <div className="w-full h-[100vh] pt-[3.5rem] relative bg-cover max-sm:bg-center bg-no-repeat bg-background grid grid-cols-3  grid-rows-[1fr_1fr_1fr_1fr_0.3fr] p-2 ">
        <p className="text-phoenix col-start-1 justify-self-center self-center text-[25px] font-extrabold p-3 bg-black bg-opacity-50 rounded-2xl border-2 w-fit h-fit font-palanquin">
          Step into the ultimate basketball experience in the best league
        </p>
        <p className="text-phoenix col-start-3 row-start-2 p-3 bg-black bg-opacity-50 rounded-2xl border-2 w-fit h-fit font-palanquin">
          Create your draft league
        </p>
        <p className="text-phoenix col-start-1 row-start-3 p-3 bg-black bg-opacity-50 rounded-2xl border-2 w-fit h-fit font-palanquin">
          Dominate the court with friends
        </p>
        <p className="text-phoenix col-start-3 row-start-4 p-3 bg-black bg-opacity-50 rounded-2xl border-2 w-fit h-fit font-palanquin">
          Make your dream team
        </p>
        <p className="text-phoenix col-start-1 row-start-5 col-span-3 justify-self-center font-extrabold text-[30px] bg-black bg-opacity-30 p-3 font-palanquin cursor-pointer">
          Phoenix Fantasy
          <span className="text-white"> - The Home </span>
          <span className="text-white">of</span> Draft Basketball
          <span className="text-white">. Click here to </span>get started!
        </p>
        <div className="bg-ball  bg-no-repeat w-[200px] h-[300px] row-start-2 row-span-3 col-start-2 justify-self-center self-center"></div>
      </div>
      <div>nesto ispod</div>
    </>
  );
};

export default Home;
