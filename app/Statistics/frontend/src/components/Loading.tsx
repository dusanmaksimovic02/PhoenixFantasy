import { motion } from "framer-motion";
import { type FC } from "react";
import ball from "../assets/images/ball.png";

const Loading: FC = () => {
  return (
    <div className="flex items-center justify-center h-full w-full absolute top-0 left-0 bg-black/50 z-9999">
      <motion.img
        src={ball}
        alt="Flaming basketball"
        style={{ width: 100, height: 120, cursor: "pointer" }}
        animate={{
          y: [0, -100, 0],
          scale: [1, 1.1, 1.2, 1.3, 1.2, 1.1, 1],
        }}
        transition={{
          duration: 1,
          ease: "easeInOut",
          repeat: Infinity,
          repeatType: "loop",
        }}
      />
    </div>
  );
};

export default Loading;
