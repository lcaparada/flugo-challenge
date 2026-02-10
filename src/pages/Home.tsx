import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { Box, Button, Typography } from "@mui/material";
import { collaboratorsMock } from "@/data/collaborators";
import { CollaboratorsList, PageHeader } from "@/components";

const MotionBox = motion(Box);

export default function Home() {
  const navigate = useNavigate();

  return (
    <MotionBox
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      sx={{
        width: "100%",
        bgcolor: "background.default",
        minHeight: "100vh",
        px: 4,
        py: 3,
      }}
    >
      <PageHeader />

      <Box component="main" sx={{ mt: 4 }}>
        <MotionBox
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 3,
          }}
        >
          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontWeight: 700,
              color: "text.primary",
            }}
          >
            Colaboradores
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("/colaboradores/novo")}
          >
            Novo Colaborador
          </Button>
        </MotionBox>

        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
        >
          <CollaboratorsList collaborators={collaboratorsMock} />
        </MotionBox>
      </Box>
    </MotionBox>
  );
}
