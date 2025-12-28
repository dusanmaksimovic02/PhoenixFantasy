type CountdownBoxProps = {
  value: number;
  label: string;
  blink?: boolean;
};

const CountdownBox = ({ value, label, blink }: CountdownBoxProps) => {
  return (
    <div
      className={`flex flex-col items-center px-4 py-3 rounded-xl max-sm:pr-3
      ${
        blink
          ? "bg-red-600 text-white"
          : "text-black dark:text-white bg-surface-light dark:bg-surface-dark"
      }
      transition-all duration-300`}
    >
      <span className="countdown font-mono text-4xl">
        <span style={{ "--value": value } as React.CSSProperties}  aria-live="polite" />
      </span>
      <span className="text-sm font-semibold mt-1">{label}</span>
    </div>
  );
};

export default CountdownBox;
