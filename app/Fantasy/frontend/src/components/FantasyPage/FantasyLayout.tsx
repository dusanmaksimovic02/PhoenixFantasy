import { Outlet } from "react-router-dom";

const FantasyLayout = () => {
  return (
    <div className="min-h-screen w-screen">
      <Outlet />
    </div>
  );
};

export default FantasyLayout;
