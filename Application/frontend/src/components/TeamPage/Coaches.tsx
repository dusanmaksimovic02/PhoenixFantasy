import { useNavigate } from "react-router";
import { Coach } from "../../models/Coach.modal";

type Props = {
  coaches: Coach[];
};

const TABLE_HEAD = ["Full name", "Country", "Age", "Experience", "Role"];

const Coaches = (props: Props) => {
  const navigate = useNavigate();

  const handleRowClick = (coach: Coach) => {
    const coachName = `${coach.firstName}-${coach.lastName}`
      .toLowerCase()
      .replace(/\s+/g, "-");
    const team = coach.team.toLowerCase().replace(/\s+/g, "-");

    navigate(`/team/${team}/coach/${coachName}`, {
      state: { coach },
    });
  };

  return (
    <div className="w-full overflow-hidden rounded-lg border border-surface max-sm:overflow-x-scroll scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-700  hover:scrollbar-thumb-gray-400 active:scrollbar-thumb-gray-300 scrollbar-thumb-rounded scrollbar-track-rounded">
      <table className="w-full">
        <thead className="border-b border-surface bg-surface-light text-sm font-medium text-foreground dark:bg-surface-dark">
          <tr>
            {TABLE_HEAD.map((head) => (
              <th
                key={head}
                className="px-2.5 py-2 text-start font-bold text-lg"
              >
                {head}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="group text-sm text-black dark:text-white">
          {props.coaches.map((coach, index) => {
            return (
              <tr
                key={index}
                className="even:bg-surface-light dark:even:bg-surface-dark cursor-pointer"
                onClick={() => handleRowClick(coach)}
              >
                <td className="p-3 text-nowrap">{`${coach.firstName} ${coach.lastName}`}</td>
                <td className="p-3">{`${coach.country}`}</td>
                <td className="p-3 text-nowrap">{`${coach.age}`}</td>
                <td className="p-3 text-nowrap">{`${coach.experience} years`}</td>
                <td className="p-3 text-nowrap">{`${coach.role} `}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Coaches;
