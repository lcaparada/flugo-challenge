import { Menu } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { motion } from "motion/react";

type MenuButtonProps = {
  onClick: () => void;
};

const MotionIconButton = motion(IconButton);

export function MenuButton({ onClick }: MenuButtonProps) {
  return (
    <MotionIconButton
      onClick={onClick}
      aria-label="Abrir menu"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      sx={{
        display: { xs: "flex", md: "none" },
        position: "fixed",
        top: 16,
        left: 16,
        zIndex: 50,
        bgcolor: "background.paper",
        border: 1,
        borderColor: "divider",
        borderRadius: 2,
        boxShadow: 3,
        "&:hover": {
          bgcolor: "background.paper",
        },
      }}
    >
      <Menu sx={{ color: "text.secondary" }} />
    </MotionIconButton>
  );
}
