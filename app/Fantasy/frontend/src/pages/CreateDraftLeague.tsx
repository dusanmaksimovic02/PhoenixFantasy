import { type FC } from "react";
import { useParams } from "react-router-dom";

const CreateDraftLeague: FC = () => {
  const { leagueName, code } = useParams();
  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center pt-15">
      <h1>CreateDraftLeague</h1>
      <h2>League name: {leagueName} </h2>
      <h2>League code: {code} </h2>
    </div>
  );
};

export default CreateDraftLeague;
