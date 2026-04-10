import { type FC } from "react";

const FantasyPlayerInLeague: FC = () => {
  const players: { id: number; username: string }[] = [
    {
      id: 1,
      username: "username1",
    },
    {
      id: 2,
      username: "username2",
    },
    {
      id: 3,
      username: "username3",
    },
    {
      id: 4,
      username: "username4",
    },
  ];
  return (
    <div className="overflow-x-auto rounded-xl border border-neutral-300 dark:border-neutral-700">
      <table className="table w-full bg-white dark:bg-neutral-800">
        <thead className="bg-neutral-200 text-neutral-700 dark:text-neutral-50 dark:bg-neutral-900">
          <tr>
            <th>#</th>
            <th>Username</th>
          </tr>
        </thead>
        <tbody>
          {players.map((item, index) => (
            <tr
              key={index}
              className="hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors text-nowrap"
            >
              <td>{item.id}</td>
              <td>{item.username}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FantasyPlayerInLeague;
