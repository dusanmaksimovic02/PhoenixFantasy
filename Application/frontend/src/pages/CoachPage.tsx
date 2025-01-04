import { useLocation } from "react-router";
import { Coach } from "../models/Coach.modal";

const CoachPage = () => {
  const location = useLocation();
  const coach = location.state?.coach as Coach;

  return (
    <div className="h-screen w-screen flex flex-col justify-center items-center">
      <h1>{`${coach.firstName} ${coach.lastName}`}</h1>
      <p>ID: {coach.id}</p>
      <p>Team: {coach.team}</p>
      <p>Country: {coach.country}</p>
      <p>Age: {coach.age}</p>
      <p>Experience: {coach.experience} years</p>
      <p>Role: {coach.role}</p>
      <p>Description: {coach.description}</p>
    </div>
  );
};

export default CoachPage;
