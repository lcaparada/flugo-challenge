import { motion } from "motion/react";

const spring = { type: "spring" as const, stiffness: 400, damping: 28 };

export function SidebarLogo() {
  return (
    <motion.div
      className="w-24 h-fit mb-6 cursor-pointer"
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={spring}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <img src="/logo2.png" alt="logo" className="object-cover" />
    </motion.div>
  );
}
