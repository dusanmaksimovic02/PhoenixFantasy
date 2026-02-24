import { addCoach } from "../../services/CoachService";
import { useState, type FC } from "react";
import { toast } from "react-toastify";
import z from "zod";

const formSchema = z.object({
  firstName: z.string().min(1, "Name is required"),
  lastName: z.string().min(1, "Surname is required"),
  dateOfBirth: z.date("Birth date is required"),
});

type FormData = z.infer<typeof formSchema>;

const AddCoach: FC = () => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [coach, setCoach] = useState<FormData>({
    firstName: "",
    lastName: "",
    dateOfBirth: new Date(),
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setCoach((c) => ({
      ...c,
      [name]: name === "dateOfBirth" ? new Date(value) : value,
    }));
  };

  const handleSave = async () => {
    const result = formSchema.safeParse(coach);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((i) => {
        fieldErrors[i.path[0] as string] = i.message;
      });
      setErrors(fieldErrors);
      return;
    }
    try {
      await addCoach({
        id: "3fa85f64-5717-4562-b3fc-2c963f66afa7",
        firstName: coach.firstName,
        lastName: coach.lastName,
        dateOfBirth: coach.dateOfBirth.toISOString().split("T")[0],
      });

      console.log("Coach created!");
      toast.success("Coach created successfully!");
      setErrors({});
      setCoach({
        firstName: "",
        lastName: "",
        dateOfBirth: new Date(),
      });
    } catch (err) {
      console.error(err);
    }
  };

  const formatDate = (date: Date) => {
    if (!(date instanceof Date) || isNaN(date.getTime())) return "";
    return date.toISOString().split("T")[0];
  };

  return (
    <div className="w-full max-w-2xl rounded-2xl p-8 shadow-lg bg-neutral-100 dark:bg-neutral-800">
      <h1 className="text-3xl font-bold mb-8 text-center">Add Coach</h1>

      <div className="space-y-5">
        {(
          [
            ["firstName", "First name"],
            ["lastName", "Last name"],
            ["dateOfBirth", "Birth date"],
          ] as const
        ).map(([key, label]) => (
          <div key={key}>
            <label className="block mb-1 font-medium">{label}</label>
            <input
              name={key}
              type={key === "dateOfBirth" ? "date" : "text"}
              value={
                key === "dateOfBirth"
                  ? formatDate(coach[key] as Date)
                  : (coach[key] as string)
              }
              onChange={handleChange}
              className="
                  w-full px-4 py-3 rounded-xl
                  bg-white dark:bg-neutral-700
                  border border-neutral-300 dark:border-neutral-600
                  disabled:opacity-70
                "
            />
            {errors[key] && (
              <p className="text-red-500 text-sm mt-1">{errors[key]}</p>
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-10">
        <button
          className="px-10 py-3 rounded-xl text-white font-semibold
              bg-phoenix/60 hover:bg-phoenix/95 transition-all cursor-pointer"
          onClick={handleSave}
        >
          Add coach
        </button>
      </div>
    </div>
  );
};

export default AddCoach;
