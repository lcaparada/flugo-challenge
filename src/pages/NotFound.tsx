import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { Box, Button, Typography } from "@mui/material";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
        py: 4,
      }}
    >
      <Typography
        variant="h1"
        component="p"
        sx={{
          fontSize: { xs: "4rem", sm: "6rem" },
          fontWeight: 700,
          color: "primary.main",
          lineHeight: 1,
        }}
      >
        404
      </Typography>
      <Typography
        variant="h5"
        component="p"
        sx={{
          mt: 2,
          color: "text.secondary",
          textAlign: "center",
        }}
      >
        Página não encontrada
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate("/")}
        sx={{
          mt: 3,
          textTransform: "none",
          fontWeight: 600,
        }}
      >
        Ir para o início
      </Button>
    </Box>
  );
}
