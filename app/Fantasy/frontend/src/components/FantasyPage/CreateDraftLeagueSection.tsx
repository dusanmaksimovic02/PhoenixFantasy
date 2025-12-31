import { zodResolver } from "@hookform/resolvers/zod";
import { useState, type FC } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import z from "zod";

const formCreateSchema = z.object({
  leagueName: z.string().min(1, { message: "League name is required!" }),
  leagueCapacity: z
    .number({ message: "League capacity must be a number!" })
    .min(2, { message: "League capacity must be at least 2!" })
    .max(10, { message: "League capacity must be at most 10!" }),
  yourTeamName: z.string().min(1, { message: "Your team name is required!" }),
});

type FormInputsCreate = z.infer<typeof formCreateSchema>;

const CreateDraftLeagueSection: FC = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInputsCreate>({
    resolver: zodResolver(formCreateSchema),
    defaultValues: {
      leagueName: "",
      leagueCapacity: 2,
      yourTeamName: "",
    },
  });

  const leagueNameError = errors.leagueName?.message;
  const leagueCapacityError = errors.leagueCapacity?.message;
  const yourTeamNameError = errors.yourTeamName?.message;

  const onValid = (data: FormInputsCreate) => {
    console.log("Submit create draft league " + data);
    toast.success("Successfully created draft league!");
    navigate(`draft/${data.leagueName}`);
    reset();
    setIsOpen(false);
  };

  const onInvalid = () => {
    console.log("Form has errors");
    toast.error("Please insert valid data!");
  };

  return (
    <>
      <button
        className="btn text-black dark:text-white bg-phoenix/80 hover:bg-phoenix hover:border-phoenix border-phoenix hover:border-4 hover:cursor-pointer shadow-inner drop-shadow min-w-60 h-15 rounded-2xl text-xl mt-5 p-3 max-sm:text-[1.1rem] max-sm:min-w-45 max-sm:mt-5"
        onClick={() => setIsOpen(true)}
      >
        Create Draft League
      </button>
      <dialog open={isOpen} className="modal">
        <div className="modal-box bg-white dark:bg-custom-gray">
          <form
            noValidate
            onSubmit={handleSubmit(onValid, onInvalid)}
            className="w-full"
          >
            <button
              type="button"
              className="btn btn-sm text-red-600 btn-circle btn-ghost absolute right-2 top-2"
              onClick={() => {
                setIsOpen(false);
                reset();
              }}
            >
              ✕
            </button>
            <h3 className="text-phoenix">Create Draft League</h3>
            <label
              htmlFor="league-name"
              className="w-full block text-white p-5 "
            >
              <span className="label text-start w-full p-2">
                <span className="text-black dark:text-white font-semibold text-sm">
                  League Name
                </span>
              </span>
              <div className="relative">
                <input
                  id="league-name"
                  {...register("leagueName")}
                  type="text"
                  placeholder="Enter Draft League Name"
                  className={`input w-full pl-10 text-black dark:text-white border-black dark:border-white hover:border-phoenix bg-transparent  border-2 not-[]:border-white focus:border-phoenix focus:outline-phoenix focus:border-0 rounded-md ${
                    leagueNameError ? "input-error" : ""
                  }`}
                />
              </div>
              {leagueNameError && (
                <span className="text-error text-sm font-semibold mt-5">
                  {leagueNameError}
                </span>
              )}
            </label>
            <label
              htmlFor="league-capacity"
              className="w-full block text-white p-5 pt-0"
            >
              <span className="label text-start w-full p-2 pt-0">
                <span className="text-black dark:text-white font-semibold text-sm">
                  League Capacity
                </span>
              </span>
              <div className="relative">
                <input
                  id="league-capacity"
                  {...register("leagueCapacity", { valueAsNumber: true })}
                  type="number"
                  min={2}
                  max={10}
                  formNoValidate
                  onKeyDown={(e) => {
                    if (["e", "E", "+", "-", "."].includes(e.key)) {
                      e.preventDefault();
                    }
                  }}
                  placeholder="Enter Draft League Capacity"
                  className={`input w-full pl-10 text-black dark:text-white border-black dark:border-white hover:border-phoenix bg-transparent  border-2 not-[]:border-white focus:border-phoenix focus:outline-phoenix focus:border-0 rounded-md ${
                    leagueCapacityError ? "input-error" : ""
                  }`}
                />
              </div>
              {leagueCapacityError && (
                <span className="text-error text-sm font-semibold mt-5">
                  {leagueCapacityError}
                </span>
              )}
            </label>
            <label
              htmlFor="team-name"
              className="w-full block text-white p-5 pt-0"
            >
              <span className="label text-start w-full p-2 pt-0">
                <span className="text-black dark:text-white font-semibold text-sm">
                  Team Name
                </span>
              </span>
              <div className="relative">
                <input
                  id="team-name"
                  {...register("yourTeamName")}
                  type="text"
                  placeholder="Enter Your Team Name"
                  className={`input w-full pl-10 text-black dark:text-white border-black dark:border-white hover:border-phoenix bg-transparent  border-2 not-[]:border-white focus:border-phoenix focus:outline-phoenix focus:border-0 rounded-md ${
                    yourTeamNameError ? "input-error" : ""
                  }`}
                />
              </div>
              {yourTeamNameError && (
                <span className="text-error text-sm font-semibold mt-5">
                  {yourTeamNameError}
                </span>
              )}
            </label>
            <button
              type="submit"
              className="btn bg-phoenix/80 hover:bg-phoenix hover:border-phoenix border-phoenix hover:border-4 hover:cursor-pointer shadow-inner drop-shadow rounded-xl text-xl"
            >
              Submit code
            </button>
          </form>
        </div>
      </dialog>
    </>
  );
};

export default CreateDraftLeagueSection;
