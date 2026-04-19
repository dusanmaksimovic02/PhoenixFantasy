import { FaRegCopy, FaCheck } from "react-icons/fa";
import { useState } from "react";

const JoinCodeBox = ({ joinCode }: { joinCode: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(joinCode);
      setCopied(true);

      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy!", err);
    }
  };

  return (
    <div className="border-2 rounded-2xl gap-5 flex flex-col p-5 text-center h-fit">
      <h5 className="max-md:text-sm">Join League Code</h5>
      <div className="flex items-center justify-center gap-3">
        <h3 className="tracking-wider">{joinCode}</h3>
        <button
          onClick={handleCopy}
          className="p-2 rounded-full hover:bg-phoenix/20 transition-all cursor-pointer"
          title="Copy to clipboard"
        >
          {copied ? (
            <FaCheck className="text-green-500" />
          ) : (
            <FaRegCopy className="text-phoenix hover:scale-110 transition-transform" />
          )}
        </button>
      </div>
      {copied && (
        <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-green-500 font-bold">
          Copied!
        </span>
      )}
    </div>
  );
};

export default JoinCodeBox;
