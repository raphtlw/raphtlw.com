import { ArrowUpRightIcon } from "lucide-react";
import * as motion from "motion/react-client";

export type LinkButtonProps = {
  children: React.ReactNode;
  href?: string;
};

export const LinkButton = ({ children, href = "#" }: LinkButtonProps) => {
  return (
    <motion.a
      href={href}
      className="inline-flex items-center gap-1"
      whileHover="hovered"
      whileTap="hovered"
      initial="rest"
    >
      <motion.span
        className="inline-flex items-center"
        whileHover="hovered"
        initial={{
          opacity: 1,
          filter: "brightness(1)",
          transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] },
        }}
        whileTap={{
          opacity: 0.4,
          filter: "brightness(1.2)",
          transition: { duration: 0.02, ease: "linear" },
        }}
      >
        {children}
      </motion.span>

      <motion.span
        variants={{
          rest: { x: 2, y: -2 },
          hovered: { x: 4, y: -4 },
        }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
      >
        <ArrowUpRightIcon size={14} />
      </motion.span>
    </motion.a>
  );
};
