import type { FC } from "react";

type Props = {
  onPlusClick: () => void;
  onMinusClick: () => void;
  minusDisable: () => boolean;
};

const PlusMinusButtons: FC<Props> = (props) => {
  return (
    <div className="flex">
      {" "}
      <button
        className="text-xl cursor-pointer btn btn-ghost hover:bg-transparent rounded-xl border border-black dark:border-white dark:hover:text-white hover:text-black border-r-0 rounded-r-none"
        onClick={() => props.onPlusClick()}
      >
        +
      </button>
      <button
        className="text-xl cursor-pointer btn btn-ghost hover:bg-transparent rounded-xl border border-black hover:text-black dark:hover:text-white dark:border-white border-l-0 rounded-l-none disabled:text-black/50 dark:disabled:text-white/50"
        onClick={() => props.onMinusClick()}
        disabled={props.minusDisable()}
      >
        -
      </button>
    </div>
  );
};

export default PlusMinusButtons;
