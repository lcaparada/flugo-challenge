import { Link } from "react-router-dom";
import { ChevronRight } from "@mui/icons-material";
import type { ReactNode } from "react";
import { motion } from "motion/react";
import { cn } from "../utils/cn";

type SidebarNavItemProps = {
  to: string;
  label: string;
  icon: ReactNode;
};

const spring = { type: "spring" as const, stiffness: 400, damping: 28 };

export default function SidebarNavItem({
  to,
  label,
  icon,
}: SidebarNavItemProps) {
  return (
    <motion.div
      className={cn(
        "flex items-center justify-between",
        "rounded-lg py-2 px-2 -mx-2",
        "cursor-pointer group"
      )}
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={spring}
      whileHover={{ scale: 1.02, x: 2 }}
      whileTap={{ scale: 0.98 }}
    >
      <Link to={to} className="flex items-center gap-x-2 flex-1 min-w-0">
        <span className="flex items-center gap-x-2 shrink-0">{icon}</span>
        <span className="text-sidebar-text font-medium truncate">{label}</span>
      </Link>
      <span
        className={cn(
          "text-sidebar-text shrink-0 inline-block",
          "transition-transform duration-200 ease-out",
          "group-hover:translate-x-1"
        )}
      >
        <ChevronRight />
      </span>
    </motion.div>
  );
}
