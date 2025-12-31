import { zodResolver } from "@hookform/resolvers/zod";
import { useState, type FC } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import z from "zod";

const formJoinSchema = z.object({
  code: z.string().min(1, { message: "Code is required!" }),
  teamName: z.string().min(1, { message: "Team name is required!" }),
});

type FormInputsJoin = z.infer<typeof formJoinSchema>;

const JoinDraftLeagueSection: FC = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInputsJoin>({
    resolver: zodResolver(formJoinSchema),
    defaultValues: {
      code: "",
      teamName: "",
    },
  });

  const codeError = errors.code?.message;
  const teamNameError = errors.teamName?.message;

  const onValid = (data: FormInputsJoin) => {
    console.log("Valid submit", data);

    toast.success("Successfully joined draft league!");

    navigate(`draft/Bagra/${data.code}`);
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
        className="btn bg-transparent text-black dark:text-white hover:border-phoenix border-phoenix hover:border-4 hover:cursor-pointer shadow-inner drop-shadow min-w-60 h-15 rounded-2xl text-xl mt-5 p-3 max-sm:text-[1.1rem] max-sm:min-w-45  max-sm:mt-5"
        onClick={() => setIsOpen(true)}
      >
        Join Draft League
      </button>
      <dialog open={isOpen} className="modal">
        <div className="modal-box bg-white dark:bg-custom-gray">
          <form onSubmit={handleSubmit(onValid, onInvalid)} className="w-full">
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
            <h4 className="text-phoenix">
              Join a Draft League by entering the code below
            </h4>
            <label htmlFor="code" className="w-full block text-white p-5 ">
              <div className="relative">
                <input
                  id="code"
                  {...register("code")}
                  type="text"
                  placeholder="Enter Draft League Code"
                  className={`input w-full pl-10  border-black dark:border-white hover:border-phoenix bg-transparent text-black dark:text-white border-2 not-[]:border-white focus:border-phoenix focus:outline-phoenix focus:border-0 rounded-md ${
                    codeError ? "input-error" : ""
                  }`}
                />
              </div>
              {codeError && (
                <span className="text-error text-sm font-semibold mt-5">
                  {codeError}
                </span>
              )}
            </label>
            <label htmlFor="team-name" className="w-full block text-white p-5 ">
              <div className="relative">
                <input
                  id="team-name"
                  {...register("teamName")}
                  type="text"
                  placeholder="Enter Your Team Name"
                  className={`input w-full pl-10 border-black dark:border-white hover:border-phoenix bg-transparent text-black dark:text-white border-2 not-[]:border-white focus:border-phoenix focus:outline-phoenix focus:border-0 rounded-md ${
                    teamNameError ? "input-error" : ""
                  }`}
                />
              </div>
              {teamNameError && (
                <span className="text-error text-sm font-semibold mt-5">
                  {teamNameError}
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

export default JoinDraftLeagueSection;
