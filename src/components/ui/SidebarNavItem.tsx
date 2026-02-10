import { Link } from "react-router-dom";
import { ChevronRight } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";
import type { ReactNode } from "react";
import { motion } from "motion/react";

type SidebarNavItemProps = {
  to: string;
  label: string;
  icon: ReactNode;
};

const spring = { type: "spring" as const, stiffness: 400, damping: 28 };

const MotionBox = motion(Box);

export function SidebarNavItem({ to, label, icon }: SidebarNavItemProps) {
  return (
    <MotionBox
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={spring}
      whileHover={{ scale: 1.02, x: 2 }}
      whileTap={{ scale: 0.98 }}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderRadius: 2,
        py: 1,
        px: 2,
        mx: -2,
        cursor: "pointer",
        textDecoration: "none",
        "& .chevron": {
          transition: "transform 0.2s ease-out",
        },
        "&:hover .chevron": {
          transform: "translateX(4px)",
        },
      }}
    >
      <Box
        component={Link}
        to={to}
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          flex: 1,
          minWidth: 0,
          textDecoration: "none",
          color: "inherit",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
          {icon}
        </Box>
        <Typography
          variant="body1"
          sx={{
            color: "text.secondary",
            fontWeight: 500,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {label}
        </Typography>
      </Box>
      <ChevronRight
        className="chevron"
        sx={{
          color: "text.secondary",
          flexShrink: 0,
        }}
      />
    </MotionBox>
  );
}
