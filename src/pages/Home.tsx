import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { Button } from "@mui/material";
import { collaboratorsMock } from "@/data/collaborators";
import { CollaboratorsList, PageHeader } from "@/components";

export default function Home() {
  const navigate = useNavigate();

  return (
    <motion.div
      className="w-full bg-background min-h-screen px-8 py-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <PageHeader />

      <main className="mt-8">
        <motion.section
          className="flex items-center justify-between mb-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
        >
          <h1 className="text-2xl font-bold text-text-primary">
            Colaboradores
          </h1>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("/colaboradores/novo")}
          >
            Novo Colaborador
          </Button>
        </motion.section>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
        >
          <CollaboratorsList collaborators={collaboratorsMock} />
        </motion.div>
      </main>
    </motion.div>
  );
}
