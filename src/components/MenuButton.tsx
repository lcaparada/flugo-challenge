import { Menu } from "@mui/icons-material";
import { motion } from "motion/react";
import { cn } from "../utils/cn";

type MenuButtonProps = {
  onClick: () => void;
};

export default function MenuButton({ onClick }: MenuButtonProps) {
  return (
    <motion.button
      className={cn(
        "md:hidden fixed top-4 left-4 z-50 p-2",
        "bg-sidebar-bg border border-sidebar-border",
        "rounded-lg shadow-lg"
      )}
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label="Abrir menu"
    >
      <Menu className="text-sidebar-text" />
    </motion.button>
  );
}
