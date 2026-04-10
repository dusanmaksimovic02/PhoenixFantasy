import { type FC } from "react";

const SelectPlayerOrder: FC = () => {
  return (
    <div className="border-2 rounded-2xl gap-5 flex flex-col p-5">
      <h5>Select Player Order</h5>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <select
            className={`select select-bordered w-full  bg-neutral-300 dark:bg-neutral-700  focus:outline-black dark:focus:outline-white $`}
          >
            <option value="">Select Player Order</option>
            <option value={1}>Random</option>
            <option value={2}>Earliest joined</option>
            <option value={3}>Latest joined</option>
            <option value={4}>Name ascending</option>
            <option value={5}>Name descending</option>
          </select>
        </div>
      </div>
      <button
        type="submit"
        className="px-10 py-3 rounded text-white font-semibold bg-phoenix/60 hover:bg-phoenix/95 transition-all cursor-pointer disabled:opacity-50 w-full md:w-auto"
      >
        Start Draft
      </button>
    </div>
  );
};

export default SelectPlayerOrder;
