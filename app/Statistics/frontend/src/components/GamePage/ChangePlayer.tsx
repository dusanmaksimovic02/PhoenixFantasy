import type { FC } from "react";

type Props = {
  isOpenChange: boolean;
  setIsOpenChange: (isOpen: boolean) => void;
  name: string;
  surname: string;
  position: string;
  jerseyNumber: number;
  time: Date;
};

const tableHead = [
  "Id",
  "Name",
  "Surname",
  "Position",
  "JerseyNumber",
  "Time played",
];

const ChangePlayer: FC<Props> = ({
  isOpenChange,
  setIsOpenChange,
  name,
  surname,
  position,
  jerseyNumber,
  time,
}) => {
  const players = Array.from({ length: 7 }, (_, index) => ({
    id: index + 1,
    name: `Player${index + 1}`,
    surname: `State`,
    position: [
      "Point Guard",
      "Shouting Guard",
      "Small Forward",
      "Power Forward",
      "Center",
    ][index % 5],
    jerseyNumber: (index + 3) * 4,
    time: new Date(),
  }));

  return (
    <dialog open={isOpenChange} className="modal">
      <div className="modal-box flex flex-col justify-center items-center bg-surface-light dark:bg-surface-dark rounded-4xl w-5/12 max-w-5xl ">
        <div className="modal-action text flex flex-col w-full">
          <button
            type="button"
            className="btn btn-sm text-red-600 btn-circle btn-ghost absolute right-2 top-2"
            onClick={() => {
              setIsOpenChange(false);
            }}
          >
            ✕
          </button>

          <h3 className="text-nowrap w-full text-center">Change player</h3>

          <div
            className="w-full flex items-center gap-10 p-5 border-[3px] border-surface rounded-4xl"
            onClick={() => setIsOpenChange(true)}
          >
            <div className="bg-jersey bg-contain bg-no-repeat h-20 w-15 flex justify-center items-center">
              <p className="text-black pt-4 pr-1 font-bold text-xl">
                {jerseyNumber.toString()}
              </p>
            </div>
            <div className="flex w-full justify-between items-center">
              <div>
                <p className="text-phoenix">
                  {name} {surname}
                </p>
                <p>{position}</p>
              </div>
              <div className="">
                <p>Time played</p>
                <p>{time.toLocaleTimeString()}</p>
              </div>
            </div>
          </div>

          <div className="w-full h-fit rounded-4xl border border-surface overflow-x-auto">
            <table className="w-full rounded-4xl ">
              <thead className="border-[3px] border-surface bg-surface-light text-lg font-medium text-foreground rounded-4xl  dark:bg-surface-dark">
                <tr>
                  {tableHead.map((head) => (
                    <th
                      key={head}
                      className="px-2.5 py-2  text-start  font-medium rounded-4xl "
                    >
                      {head}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="text-sm text-black dark:text-white rounded-4xl ">
                {players.map((player) => (
                  <tr
                    key={player.id}
                    className="border-[3px] border-surface whitespace-nowrap rounded-4xl cursor-pointer"
                  >
                    <td className="p-3">{player.id}</td>
                    <td className="p-3 ">{player.name}</td>
                    <td className="p-3">{player.surname}</td>
                    <td className="p-3">{player.position}</td>
                    <td className="p-3">{player.jerseyNumber}</td>
                    <td className="p-3">{player.time.toLocaleTimeString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </dialog>
  );
};

export default ChangePlayer;
