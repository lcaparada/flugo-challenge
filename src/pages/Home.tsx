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
        maxWidth: "100vw",
        bgcolor: "background.default",
        minHeight: "100vh",
        px: { xs: 2, sm: 3, md: 4 },
        py: { xs: 2, sm: 3 },
        overflowX: "hidden",
      }}
    >
      <PageHeader />

      <Box 
        component="main" 
        sx={{ 
          mt: { xs: 2, sm: 3, md: 4 },
          width: "100%",
          maxWidth: "100%",
        }}
        role="main"
        aria-label="Conteúdo principal"
      >
        <MotionBox
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: { xs: "flex-start", sm: "center" },
            justifyContent: "space-between",
            gap: { xs: 2, sm: 0 },
            mb: { xs: 2, sm: 3 },
          }}
        >
          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontWeight: 700,
              color: "text.primary",
              fontSize: { xs: "1.5rem", sm: "2rem", md: "2.125rem" },
            }}
          >
            Colaboradores
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("/colaboradores/novo")}
            fullWidth
            sx={{
              width: { xs: "100%", sm: "auto" },
            }}
            aria-label="Criar novo colaborador"
          >
            Novo Colaborador
          </Button>
        </MotionBox>

        <CollaboratorsList collaborators={collaboratorsMock} />
      </Box>
    </MotionBox>
  );
}
