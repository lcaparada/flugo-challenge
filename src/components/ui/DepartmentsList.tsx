import { useState, useMemo } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Typography from "@mui/material/Typography";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { EmptyState } from "@/components/ui/EmptyState";
import type { Department } from "@/types/department";
import type { Collaborator } from "@/types/collaborator";
import { useDeleteDepartments } from "@/useCases";

type DepartmentsListProps = {
  departments: Department[];
  collaborators: Collaborator[];
  emptyStateAction?: {
    label: string;
    onClick: () => void;
  };
  onEdit: (department: Department) => void;
};

type Order = "asc" | "desc";

function getManagerName(department: Department, collaborators: Collaborator[]) {
  if (!department.managerId) return "—";
  return collaborators.find((c) => c.id === department.managerId)?.name ?? "—";
}

export function DepartmentsList({
  departments,
  collaborators,
  emptyStateAction,
  onEdit,
}: DepartmentsListProps) {
  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState<"name" | "collaboratorIds">("name");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [deleteConfirm, setDeleteConfirm] = useState<{
    ids: string[];
    name?: string;
  } | null>(null);

  const { mutateAsync: deleteDepartments, isPending: isDeleting } =
    useDeleteDepartments();

  const sortedDepartments = useMemo(() => {
    return [...departments].sort((a, b) => {
      const mult = order === "asc" ? 1 : -1;
      if (orderBy === "name") {
        return mult * a.name.localeCompare(b.name);
      }
      return mult * (a.collaboratorIds.length - b.collaboratorIds.length);
    });
  }, [departments, order, orderBy]);

  const allSelected =
    departments.length > 0 && selectedIds.size === departments.length;
  const someSelected = selectedIds.size > 0;

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedIds(new Set(departments.map((d) => d.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleSelectOne = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleDeleteClick = (department: Department) => {
    setDeleteConfirm({ ids: [department.id], name: department.name });
  };

  const handleBulkDeleteClick = () => {
    setDeleteConfirm({ ids: Array.from(selectedIds) });
  };

  const handleConfirmDelete = async () => {
    if (!deleteConfirm) return;
    await deleteDepartments(deleteConfirm.ids);
    setSelectedIds((prev) => {
      const next = new Set(prev);
      deleteConfirm.ids.forEach((id) => next.delete(id));
      return next;
    });
    setDeleteConfirm(null);
  };

  if (departments.length === 0) {
    return (
      <EmptyState
        title="Nenhum departamento cadastrado"
        description="Adicione o primeiro departamento para começar."
        primaryAction={emptyStateAction}
      />
    );
  }

  return (
    <Box>
      {someSelected && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            mb: 2,
            py: 1.5,
            px: 2,
            borderRadius: 2,
            bgcolor: "action.selected",
          }}
        >
          <Typography component="span" variant="body2" fontWeight={500}>
            {selectedIds.size} selecionado(s)
          </Typography>
          <Button
            size="small"
            color="error"
            variant="outlined"
            startIcon={<DeleteIcon />}
            onClick={handleBulkDeleteClick}
            disabled={isDeleting}
            sx={{ textTransform: "none" }}
          >
            Excluir selecionados
          </Button>
          <Button
            size="small"
            variant="text"
            onClick={() => setSelectedIds(new Set())}
            sx={{ textTransform: "none" }}
          >
            Desmarcar todos
          </Button>
        </Box>
      )}
      <TableContainer
        sx={{
          maxHeight: { xs: "60vh", sm: "65vh", md: "70vh" },
          overflow: "auto",
          borderWidth: 1,
          borderColor: "divider",
          borderStyle: "solid",
          borderRadius: 4,
          boxShadow: "5px 3px 12px -9px #000000",
        }}
      >
        <Table stickyHeader>
          <TableHead sx={{ backgroundColor: "grey.100" }}>
            <TableRow>
              <TableCell padding="checkbox" sx={{ fontWeight: 600, color: "grey.500", py: { xs: 1.5, sm: 2 } }}>
                <Checkbox
                  indeterminate={someSelected && !allSelected}
                  checked={allSelected}
                  onChange={handleSelectAll}
                  aria-label="Selecionar todos"
                  size="small"
                />
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 600,
                  color: "grey.500",
                  fontSize: { xs: "0.75rem", sm: "0.875rem" },
                  px: { xs: 1, sm: 2 },
                  py: { xs: 1.5, sm: 2 },
                }}
              >
                <TableSortLabel
                  active={orderBy === "name"}
                  direction={orderBy === "name" ? order : "asc"}
                  onClick={() => {
                    const nextAsc = orderBy !== "name" || order !== "asc";
                    setOrderBy("name");
                    setOrder(nextAsc ? "asc" : "desc");
                  }}
                  aria-label="Ordenar por Nome"
                >
                  Nome
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ fontWeight: 600, color: "grey.500", fontSize: { xs: "0.75rem", sm: "0.875rem" }, px: { xs: 1, sm: 2 }, py: { xs: 1.5, sm: 2 } }}>
                Gestor
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 600,
                  color: "grey.500",
                  fontSize: { xs: "0.75rem", sm: "0.875rem" },
                  px: { xs: 1, sm: 2 },
                  py: { xs: 1.5, sm: 2 },
                }}
              >
                <TableSortLabel
                  active={orderBy === "collaboratorIds"}
                  direction={orderBy === "collaboratorIds" ? order : "asc"}
                  onClick={() => {
                    const nextAsc = orderBy !== "collaboratorIds" || order !== "asc";
                    setOrderBy("collaboratorIds");
                    setOrder(nextAsc ? "asc" : "desc");
                  }}
                  aria-label="Ordenar por Colaboradores"
                >
                  Colaboradores
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ fontWeight: 600, color: "grey.500", fontSize: { xs: "0.75rem", sm: "0.875rem" }, px: { xs: 1, sm: 2 }, py: { xs: 1.5, sm: 2 }, width: 120 }}>
                Ações
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedDepartments.map((department) => (
              <TableRow
                key={department.id}
                sx={{ "&:hover": { backgroundColor: "action.hover" } }}
              >
                <TableCell padding="checkbox" sx={{ py: { xs: 1.5, sm: 2 } }}>
                  <Checkbox
                    checked={selectedIds.has(department.id)}
                    onChange={() => handleSelectOne(department.id)}
                    aria-label={`Selecionar ${department.name}`}
                    size="small"
                  />
                </TableCell>
                <TableCell sx={{ px: { xs: 1, sm: 2 }, py: { xs: 1.5, sm: 2 }, fontWeight: 500 }}>
                  {department.name}
                </TableCell>
                <TableCell sx={{ color: "grey.500", px: { xs: 1, sm: 2 }, py: { xs: 1.5, sm: 2 }, fontSize: { xs: "0.75rem", sm: "0.875rem" } }}>
                  {getManagerName(department, collaborators)}
                </TableCell>
                <TableCell sx={{ color: "grey.500", px: { xs: 1, sm: 2 }, py: { xs: 1.5, sm: 2 }, fontSize: { xs: "0.75rem", sm: "0.875rem" } }}>
                  {department.collaboratorIds?.length ?? 0}
                </TableCell>
                <TableCell sx={{ px: { xs: 1, sm: 2 }, py: { xs: 1.5, sm: 2 }, width: 120 }}>
                  <Box sx={{ display: "flex", gap: 0.5 }}>
                    <IconButton
                      size="small"
                      onClick={() => onEdit(department)}
                      aria-label={`Editar ${department.name}`}
                      color="primary"
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteClick(department)}
                      aria-label={`Excluir ${department.name}`}
                      color="error"
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={deleteConfirm !== null} onClose={() => setDeleteConfirm(null)} aria-labelledby="delete-department-dialog-title" PaperProps={{ sx: { borderRadius: 2 } }}>
        <DialogTitle id="delete-department-dialog-title">
          {deleteConfirm?.ids.length === 1 ? "Excluir departamento?" : "Excluir departamentos?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {deleteConfirm?.ids.length === 1 && deleteConfirm?.name
              ? `Tem certeza que deseja excluir "${deleteConfirm.name}"? Os colaboradores do departamento precisarão ser transferidos.`
              : `Tem certeza que deseja excluir ${deleteConfirm?.ids.length ?? 0} departamentos? Esta ação não pode ser desfeita.`}
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => setDeleteConfirm(null)} color="inherit" sx={{ textTransform: "none" }}>
            Cancelar
          </Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained" disabled={isDeleting} sx={{ textTransform: "none" }}>
            {isDeleting ? "Excluindo…" : "Excluir"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
