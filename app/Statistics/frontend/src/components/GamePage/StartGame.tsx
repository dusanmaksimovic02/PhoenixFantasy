import { type FC } from "react";

interface startGameProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const StartGame: FC<startGameProps> = (props) => {
  return (
    <dialog open={props.isOpen} className="modal">
      <div className="modal-box bg-white dark:bg-neutral-800">–
        <button
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          onClick={() => props.setIsOpen(false)}
        >
          ✕
        </button>
        <h3 className="text-xl font-bold text-phoenix text-center mb-6">
          Edit Game
        </h3>
        {/* 
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 font-medium">Home Team</label>
              <div className="dropdown w-full">
                <div
                  tabIndex={0}
                  role="button"
                  className="flex items-center justify-between px-4 py-3 rounded-xl bg-white dark:bg-neutral-700 border border-neutral-300"
                >
                  {homeTeam ? `${homeTeam.name}` : "Select a team"}
                  <IoIosArrowDown />
                </div>
                <ul
                  tabIndex={0}
                  className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-full max-h-60 overflow-y-auto z-10"
                >
                  {teams.map((t) => (
                    <li
                      key={t.id}
                      onClick={() => {
                        (document.activeElement as HTMLElement)?.blur();
                        setValue("homeTeam", t, {
                          shouldValidate: true,
                          shouldDirty: true,
                        });
                      }}
                    >
                      <a>{t.name}</a>
                    </li>
                  ))}
                </ul>
              </div>
              {errors.homeTeam && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.homeTeam.message}
                </p>
              )}
            </div>

            <div>
              <label className="block mb-1 font-medium">Away Team</label>
              <div className="dropdown w-full">
                <div
                  tabIndex={0}
                  role="button"
                  className="flex items-center justify-between px-4 py-3 rounded-xl bg-white dark:bg-neutral-700 border border-neutral-300"
                >
                  {awayTeam ? `${awayTeam.name}` : "Select a team"}{" "}
                  <IoIosArrowDown />
                </div>
                <ul
                  tabIndex={0}
                  className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-full max-h-60 overflow-y-auto z-10"
                >
                  {teams.map((t) => (
                    <li
                      key={t.id}
                      onClick={() => {
                        (document.activeElement as HTMLElement)?.blur();
                        setValue("awayTeam", t, {
                          shouldValidate: true,
                          shouldDirty: true,
                        });
                      }}
                    >
                      <a>{t.name}</a>
                    </li>
                  ))}
                </ul>
              </div>
              {errors.awayTeam && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.awayTeam.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 font-medium">Date</label>
              <input
                type="date"
                {...register("date")}
                className={`w-full px-4 py-3 rounded-xl bg-white dark:bg-neutral-700 border ${
                  errors.date ? "border-red-500" : "border-neutral-300"
                }`}
              />
              {errors.date && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.date.message}
                </p>
              )}
            </div>

            <div>
              <label className="block mb-1 font-medium">Time</label>
              <input
                type="time"
                {...register("time")}
                className={`w-full px-4 py-3 rounded-xl bg-white dark:bg-neutral-700 border ${
                  errors.time ? "border-red-500" : "border-neutral-300"
                }`}
              />
              {errors.time && (
                <p className="text-red-500 text-sm">{errors.time.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 font-medium">Venue</label>
              <input
                type="text"
                {...register("venue")}
                className={`w-full px-4 py-3 rounded-xl bg-white dark:bg-neutral-700 border ${
                  errors.venue ? "border-red-500" : "border-neutral-300"
                }`}
              />
              {errors.venue && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.venue.message}
                </p>
              )}
            </div>

            <div>
              <label className="block mb-1 font-medium">Referee</label>
              <div className="dropdown w-full">
                <div
                  tabIndex={0}
                  role="button"
                  className="flex items-center justify-between px-4 py-3 rounded-xl bg-white dark:bg-neutral-700 border border-neutral-300"
                >
                  {referee
                    ? `${referee.firstName} ${referee.lastName}`
                    : "Select a referee"}{" "}
                  <IoIosArrowDown />
                </div>
                <ul
                  tabIndex={0}
                  className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-full max-h-60 overflow-y-auto z-10"
                >
                  {referees.map((r) => (
                    <li
                      key={r.id}
                      onClick={() => {
                        (document.activeElement as HTMLElement)?.blur();
                        setValue("referee", r, {
                          // shouldValidate: true,
                          shouldDirty: true,
                        });
                      }}
                    >
                      <a>
                        {r.firstName} {r.lastName}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              {errors.referee && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.referee.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-center mt-10">
            <button
              type="submit"
              disabled={!isDirty || updateGameMutation.isPending}
              className="px-10 py-3 rounded-xl text-white font-semibold bg-phoenix/60 hover:bg-phoenix/95 transition-all cursor-pointer disabled:opacity-50 w-full md:w-auto disabled:cursor-auto"
            >
              {updateGameMutation.isPending
                ? "Updating Game..."
                : "Update Game"}
            </button>
          </div>
        </form> */}
      </div>
    </dialog>
  );
};

export default StartGame;
