import { AccountBox, Close, Logout } from "@mui/icons-material";
import { Box, IconButton, Button } from "@mui/material";
import { motion, AnimatePresence } from "motion/react";
import { useMediaQuery, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks";
import { SidebarLogo } from "./SidebarLogo";
import { SidebarNavItem } from "./SidebarNavItem";

type SidebarProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    onClose();
    navigate("/login", { replace: true });
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <Box
            component={motion.div}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            sx={{
              display: { xs: "block", md: "none" },
              position: "fixed",
              inset: 0,
              bgcolor: "rgba(0, 0, 0, 0.5)",
              zIndex: 40,
            }}
          />
        )}
      </AnimatePresence>

      <Box
        component={motion.nav}
        initial={false}
        animate={{
          x: isDesktop ? 0 : isOpen ? 0 : "-100%",
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        sx={{
          display: "flex",
          flexDirection: "column",
          bgcolor: "background.paper",
          minHeight: "100vh",
          p: 3,
          borderRight: 1,
          borderColor: "divider",
          borderStyle: "dashed",
          position: { xs: "fixed", md: "relative" },
          top: 0,
          left: 0,
          width: 256,
          zIndex: 50,
        }}
        role="navigation"
        aria-label="Menu de navegação principal"
      >
        <IconButton
          onClick={onClose}
          aria-label="Fechar menu"
          sx={{
            display: { xs: "flex", md: "none" },
            position: "absolute",
            top: 16,
            right: 16,
            color: "text.secondary",
            "&:hover": {
              bgcolor: "action.hover",
            },
          }}
        >
          <Close />
        </IconButton>

        <SidebarLogo />
        <SidebarNavItem
          to="/"
          label="Colaboradores"
          icon={<AccountBox sx={{ color: "text.secondary" }} />}
        />
        <Box sx={{ mt: "auto", pt: 2 }}>
          <Button
            fullWidth
            startIcon={<Logout />}
            onClick={handleLogout}
            sx={{
              justifyContent: "flex-start",
              textTransform: "none",
              color: "text.secondary",
            }}
            aria-label="Sair"
          >
            Sair
          </Button>
        </Box>
      </Box>
    </>
  );
}
