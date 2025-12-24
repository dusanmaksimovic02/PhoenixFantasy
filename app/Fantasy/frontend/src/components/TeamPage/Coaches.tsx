import type { FC } from "react";
import { type Coach } from "../../models/Coach.modal";

type Props = {
  coaches: Coach[];
};

const TABLE_HEAD = [
  "Photo",
  "Full name",
  "Country",
  "Age",
  "Experience",
  "Role",
  "Description",
];

const Coaches: FC<Props> = (props) => {
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
          {props.coaches.map((coach, index) => {
            return (
              <tr
                key={index}
                className="even:bg-surface-light dark:even:bg-surface-dark"
              >
                <td className="p-3 max-sm:min-w-37.5">
                  <img
                    src={coach.photoUrl}
                    alt="photo"
                    className="w-28 h-36 rounded-2xl"
                  />
                </td>
                <td className="p-3 text-nowrap">{`${coach.firstName} ${coach.lastName}`}</td>
                <td className="p-3">{`${coach.country}`}</td>
                <td className="p-3 text-nowrap">{`${coach.age}`}</td>
                <td className="p-3 text-nowrap">{`${coach.experience} years`}</td>
                <td className="p-3 text-nowrap">{`${coach.role} `}</td>
                <td className="p-3">{coach.description}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Coaches;
