import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import {
  Box,
  Button,
  TextField,
  InputAdornment,
  Typography,
  MenuItem,
  FormControl,
  Select,
  type SelectChangeEvent,
} from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";
import {
  CollaboratorsList,
  ErrorMessage,
  Loading,
  PageHeader,
} from "@/components";
import { useGetAllCollaborators } from "@/useCases";
import { departmentOptions } from "@/constants";
import type { Collaborator } from "@/types/collaborator";

const MotionBox = motion(Box);

function filterCollaborators(
  list: Collaborator[],
  filters: { name: string; email: string; department: string },
): Collaborator[] {
  const nameLower = filters.name.trim().toLowerCase();
  const emailLower = filters.email.trim().toLowerCase();
  const dept = filters.department.trim();

  return list.filter((c) => {
    if (nameLower && !c.name.toLowerCase().includes(nameLower)) return false;
    if (emailLower && !c.email.toLowerCase().includes(emailLower)) return false;
    if (dept && c.department !== dept) return false;
    return true;
  });
}

export default function Home() {
  const navigate = useNavigate();
  const [nameFilter, setNameFilter] = useState("");
  const [emailFilter, setEmailFilter] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");

  const {
    isLoading,
    isError,
    error,
    allCollaborators,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetAllCollaborators();

  const filteredCollaborators = useMemo(
    () =>
      filterCollaborators(allCollaborators, {
        name: nameFilter,
        email: emailFilter,
        department: departmentFilter,
      }),
    [allCollaborators, nameFilter, emailFilter, departmentFilter],
  );

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return (
      <ErrorMessage
        message={`Erro ao carregar colaboradores: ${error?.message ?? "Erro desconhecido"}`}
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
            placeholder="Nome do colaborador"
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
          <TextField
            label="Buscar por e-mail"
            value={emailFilter}
            onChange={(e) => setEmailFilter(e.target.value)}
            size="small"
            placeholder="E-mail"
            type="search"
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
            aria-label="Filtrar por e-mail"
          />
          <FormControl
            size="small"
            sx={{
              minWidth: { xs: "100%", sm: 200 },
              flex: { sm: "1 1 200px" },
            }}
          >
            <Select
              value={departmentFilter}
              onChange={(e: SelectChangeEvent) =>
                setDepartmentFilter(e.target.value)
              }
              displayEmpty
              aria-label="Filtrar por departamento"
            >
              <MenuItem value="">Todos</MenuItem>
              {departmentOptions.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {(nameFilter || emailFilter || departmentFilter) && (
            <Button
              variant="text"
              size="small"
              onClick={() => {
                setNameFilter("");
                setEmailFilter("");
                setDepartmentFilter("");
              }}
              sx={{ alignSelf: "center", textTransform: "none" }}
            >
              Limpar filtros
            </Button>
          )}
        </Box>

        {filteredCollaborators.length === 0 && allCollaborators.length > 0 ? (
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
            <Typography variant="body1" gutterBottom>
              Nenhum colaborador encontrado com os filtros aplicados.
            </Typography>
            <Button
              variant="text"
              onClick={() => {
                setNameFilter("");
                setEmailFilter("");
                setDepartmentFilter("");
              }}
              sx={{ textTransform: "none" }}
            >
              Limpar filtros
            </Button>
          </Box>
        ) : (
          <CollaboratorsList
            collaborators={filteredCollaborators}
            emptyStateAction={{
              label: "Novo Colaborador",
              onClick: () => navigate("/colaboradores/novo"),
            }}
          />
        )}

        {hasNextPage && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
            <Button
              variant="outlined"
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
              loading={isFetchingNextPage}
              sx={{ textTransform: "none", fontWeight: 600 }}
            >
              Carregar mais
            </Button>
          </Box>
        )}
      </Box>
    </MotionBox>
  );
}
