import { Box } from "@mui/material";
import { motion } from "motion/react";

const spring = { type: "spring" as const, stiffness: 400, damping: 28 };

const MotionBox = motion(Box);

export function SidebarLogo() {
  return (
    <MotionBox
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={spring}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      sx={{
        width: 96,
        height: "fit-content",
        mb: 3,
        cursor: "pointer",
      }}
    >
      <Box
        component="img"
        src="/logo2.png"
        alt="logo"
        sx={{
          objectFit: "cover",
          width: "100%",
          height: "auto",
        }}
      />
    </MotionBox>
  );
}
