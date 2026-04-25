import type { FC } from "react";
import { type Coach } from "../../models/Coach.modal";
import { useQuery } from "@tanstack/react-query";
import { getCoachByTeam } from "../../services/StatsService";

type Props = {
  teamId: string;
};

const TABLE_HEAD = ["", "Full name", "Date of birth"];

const Coaches: FC<Props> = ({ teamId }) => {
  const { data: coach } = useQuery<Coach>({
    queryKey: ["coach", teamId],
    queryFn: () => getCoachByTeam(teamId),
  });
  return (
    <div className="w-full overflow-hidden rounded-lg border border-surface max-sm:overflow-x-scroll">
      <table className="w-full whitespace-nowrap text-nowrap">
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
          {coach && (
            <tr className="even:bg-surface-light dark:even:bg-surface-dark">
              <td>
                {" "}
                <img
                  src={`/images/coaches/${coach.id}.webp`}
                  alt="photo"
                  className="w-50 h-60 max-sm:w-75 max-sm:h-87.5 "
                />
              </td>
              <td className="p-3 text-nowrap">{`${coach.firstName} ${coach.lastName}`}</td>
              <td className="p-3">{coach.dateOfBirth}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Coaches;
