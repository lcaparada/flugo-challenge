import { useState, useMemo } from "react";
import { motion } from "motion/react";
import { Box, Button, Typography, TextField, InputAdornment } from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";
import {
  DepartmentsList,
  DepartmentFormModal,
  ErrorMessage,
  Loading,
  PageHeader,
} from "@/components";
import { useGetAllDepartments, useGetAllCollaborators } from "@/useCases";
import type { Department } from "@/types/department";

const MotionBox = motion(Box);

export default function Departments() {
  const [nameFilter, setNameFilter] = useState("");
  const [departmentToEdit, setDepartmentToEdit] = useState<Department | null>(null);
  const [createOpen, setCreateOpen] = useState(false);

  const { departments, isLoading: deptsLoading, isError: deptsError, error: deptsErrorObj } = useGetAllDepartments();
  const { allCollaborators, isLoading: collabLoading, isError: collabError, error: collabErrorObj } = useGetAllCollaborators();

  const isLoading = deptsLoading || collabLoading;
  const isError = deptsError || collabError;
  const error = deptsErrorObj ?? collabErrorObj;

  const filteredDepartments = useMemo(() => {
    const term = nameFilter.trim().toLowerCase();
    if (!term) return departments;
    return departments.filter((d) => d.name.toLowerCase().includes(term));
  }, [departments, nameFilter]);

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return (
      <ErrorMessage
        message={`Erro ao carregar: ${error?.message ?? "Erro desconhecido"}`}
      />
    );
  }

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
            Departamentos
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              setDepartmentToEdit(null);
              setCreateOpen(true);
            }}
            sx={{ width: { xs: "100%", sm: "auto" } }}
            aria-label="Novo departamento"
          >
            Novo Departamento
          </Button>
        </MotionBox>

        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 2,
            mb: 2,
            p: 2,
            borderRadius: 2,
            bgcolor: "grey.50",
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <TextField
            label="Buscar por nome"
            value={nameFilter}
            onChange={(e) => setNameFilter(e.target.value)}
            size="small"
            placeholder="Nome do departamento"
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" fontSize="small" />
                  </InputAdornment>
                ),
              },
            }}
            sx={{
              minWidth: { xs: "100%", sm: 200 },
              flex: { sm: "1 1 200px" },
            }}
            aria-label="Filtrar por nome"
          />
        </Box>

        {filteredDepartments.length === 0 && departments.length > 0 ? (
          <Box
            sx={{
              py: 6,
              textAlign: "center",
              color: "text.secondary",
              borderRadius: 2,
              border: "1px solid",
              borderColor: "divider",
              bgcolor: "grey.50",
            }}
          >
            <Typography variant="body1">
              Nenhum departamento encontrado com o filtro aplicado.
            </Typography>
            <Button
              variant="text"
              onClick={() => setNameFilter("")}
              sx={{ mt: 1, textTransform: "none" }}
            >
              Limpar filtro
            </Button>
          </Box>
        ) : (
          <DepartmentsList
            departments={filteredDepartments}
            collaborators={allCollaborators}
            emptyStateAction={{
              label: "Novo Departamento",
              onClick: () => setCreateOpen(true),
            }}
            onEdit={(dept) => {
              setDepartmentToEdit(dept);
              setCreateOpen(false);
            }}
          />
        )}
      </Box>

      <DepartmentFormModal
        key={departmentToEdit?.id ?? (createOpen ? "create" : "closed")}
        open={createOpen || !!departmentToEdit}
        onClose={() => {
          setCreateOpen(false);
          setDepartmentToEdit(null);
        }}
        department={departmentToEdit}
        collaborators={allCollaborators}
        departments={departments}
      />
    </MotionBox>
  );
}
