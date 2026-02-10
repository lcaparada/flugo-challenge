import { AccountBox, Close } from "@mui/icons-material";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../utils/cn";
import { useMediaQuery } from "../hooks/useMediaQuery";
import SidebarLogo from "./SidebarLogo";
import SidebarNavItem from "./SidebarNavItem";

type SidebarProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="md:hidden fixed inset-0 bg-black/50 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
        )}
      </AnimatePresence>
      <motion.nav
        className={cn(
          "bg-background min-h-screen p-6 border-r border-sidebar-border border-dashed",
          "fixed top-0 left-0 w-64 z-50",
          "md:relative md:w-1/6 md:translate-x-0",
        )}
        initial={false}
        animate={{
          x: isDesktop ? 0 : isOpen ? 0 : "-100%",
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <button
          className={cn(
            "md:hidden absolute top-4 right-4 p-2",
            "text-sidebar-text hover:bg-sidebar-border/20",
            "rounded-lg transition-colors",
          )}
          onClick={onClose}
          aria-label="Fechar menu"
        >
          <Close />
        </button>

        <SidebarLogo />
        <SidebarNavItem
          to="/"
          label="Colaboradores"
          icon={<AccountBox className="text-sidebar-text" />}
        />
      </motion.nav>
    </>
  );
}
