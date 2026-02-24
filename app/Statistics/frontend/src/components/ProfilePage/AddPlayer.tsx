import { addPlayer } from "../../services/PlayerService";
import { useState, type FC } from "react";
import { toast } from "react-toastify";
import z from "zod";

const formSchema = z.object({
  firstName: z.string().min(1, "Name is required"),
  lastName: z.string().min(1, "Surname is required"),
  dateOfBirth: z.date("Birth date is required"),
  jerseyNumber: z
    .string()
    .regex(/^(0|[1-9][0-9]?|00)$/, "Jersey number must be between 00 and 99"),
});

type FormData = z.infer<typeof formSchema>;

const AddPlayer: FC = () => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [player, setPlayer] = useState<FormData>({
    firstName: "",
    lastName: "",
    dateOfBirth: new Date(),
    jerseyNumber: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "jerseyNumber") {
      const onlyNums = value.replace(/[^0-9]/g, "");
      if (onlyNums.length > 2) return;

      setPlayer((c) => ({
        ...c,
        [name]: onlyNums,
      }));
      return;
    }

    setPlayer((c) => ({
      ...c,
      [name]: name === "dateOfBirth" ? new Date(value) : value,
    }));
  };

  const handleSave = async () => {
    const result = formSchema.safeParse(player);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((i) => {
        fieldErrors[i.path[0] as string] = i.message;
      });
      setErrors(fieldErrors);
      return;
    }
    try {
      await addPlayer({
        id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        firstName: player.firstName,
        lastName: player.lastName,
        dateOfBirth: player.dateOfBirth.toISOString().split("T")[0],
        jerseyNumber: player.jerseyNumber,
      });

      console.log("Player created!");
      toast.success("Player created successfully!");
      setErrors({});
      setPlayer({
        firstName: "",
        lastName: "",
        dateOfBirth: new Date(),
        jerseyNumber: "",
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
      <h1 className="text-3xl font-bold mb-8 text-center">Add Player</h1>

      <div className="space-y-5">
        {(
          [
            ["firstName", "First name"],
            ["lastName", "Last name"],
            ["dateOfBirth", "Birth date"],
            ["jerseyNumber", "Jersey number"],
          ] as const
        ).map(([key, label]) => (
          <div key={key}>
            <label className="block mb-1 font-medium">{label}</label>
            <input
              name={key}
              type={key === "dateOfBirth" ? "date" : "text"}
              inputMode={key === "jerseyNumber" ? "numeric" : undefined}
              value={
                key === "dateOfBirth"
                  ? formatDate(player[key] as Date)
                  : (player[key] as string)
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
          Add Player
        </button>
      </div>
    </div>
  );
};

export default AddPlayer;
