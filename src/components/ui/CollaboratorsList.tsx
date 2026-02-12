import { useState, useMemo } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Avatar from "@mui/material/Avatar";
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
import { stringAvatar } from "@/utils/avatar";
import { EmptyState } from "@/components/ui/EmptyState";
import { EditCollaboratorModal } from "@/components/ui/EditCollaboratorModal";
import type { Collaborator } from "@/types/collaborator";
import { departmentOptions, levelOptions } from "@/constants";
import { useDeleteCollaborators } from "@/useCases";
import dayjs from "dayjs";

type CollaboratorsListProps = {
  collaborators: Collaborator[];
  emptyStateAction?: {
    label: string;
    onClick: () => void;
  };
};

type Order = "asc" | "desc";
type CollaboratorKey = keyof Collaborator;

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key,
): (
  a: { [key in Key]: number | string | boolean | undefined },
  b: { [key in Key]: number | string | boolean | undefined },
) => number {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

interface HeadCell {
  id: CollaboratorKey;
  label: string;
  sortable: boolean;
}

const headCells: readonly HeadCell[] = [
  { id: "name", label: "Nome", sortable: true },
  { id: "email", label: "Email", sortable: true },
  { id: "department", label: "Departamento", sortable: true },
  { id: "occupation", label: "Ocupação", sortable: true },
  { id: "level", label: "Nível", sortable: true },
  { id: "startDate", label: "Data de admissão", sortable: true },
  { id: "managerId", label: "Gestor", sortable: true },
  { id: "baseSalary", label: "Salário base", sortable: true },
  { id: "isActive", label: "Status", sortable: true },
];

export function CollaboratorsList({
  collaborators,
  emptyStateAction,
}: CollaboratorsListProps) {
  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState<CollaboratorKey>("name");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [collaboratorToEdit, setCollaboratorToEdit] =
    useState<Collaborator | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{
    ids: string[];
    name?: string;
  } | null>(null);

  const { mutateAsync: deleteCollaborators, isPending: isDeleting } =
    useDeleteCollaborators();

  const handleRequestSort = (property: CollaboratorKey) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const sortedCollaborators = useMemo(
    () =>
      [...collaborators].sort(
        getComparator(order, orderBy) as (
          a: Collaborator,
          b: Collaborator,
        ) => number,
      ),
    [collaborators, order, orderBy],
  );

  const allSelected =
    collaborators.length > 0 && selectedIds.size === collaborators.length;
  const someSelected = selectedIds.size > 0;

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedIds(new Set(collaborators.map((c) => c.id)));
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

  const handleDeleteClick = (collaborator: Collaborator) => {
    setDeleteConfirm({ ids: [collaborator.id], name: collaborator.name });
  };

  const handleBulkDeleteClick = () => {
    setDeleteConfirm({ ids: Array.from(selectedIds) });
  };

  const handleConfirmDelete = async () => {
    if (!deleteConfirm) return;
    await deleteCollaborators(deleteConfirm.ids);
    setSelectedIds((prev) => {
      const next = new Set(prev);
      deleteConfirm.ids.forEach((id) => next.delete(id));
      return next;
    });
    setDeleteConfirm(null);
  };

  if (collaborators.length === 0) {
    return (
      <EmptyState
        title="Nenhum colaborador cadastrado"
        description="Adicione o primeiro colaborador para começar."
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
              <TableCell
                padding="checkbox"
                sx={{
                  fontWeight: 600,
                  color: "grey.500",
                  fontSize: { xs: "0.75rem", sm: "0.875rem" },
                  py: { xs: 1.5, sm: 2 },
                }}
              >
                <Checkbox
                  indeterminate={someSelected && !allSelected}
                  checked={allSelected}
                  onChange={handleSelectAll}
                  aria-label="Selecionar todos"
                  size="small"
                />
              </TableCell>
              {headCells.map((headCell) => (
              <TableCell
                key={headCell.id}
                sx={{
                  fontWeight: 600,
                  color: "grey.500",
                  fontSize: { xs: "0.75rem", sm: "0.875rem" },
                  px: { xs: 1, sm: 2 },
                  py: { xs: 1.5, sm: 2 },
                }}
                sortDirection={orderBy === headCell.id ? order : false}
              >
                {headCell.sortable ? (
                  <TableSortLabel
                    active={orderBy === headCell.id}
                    direction={orderBy === headCell.id ? order : "asc"}
                    onClick={() => handleRequestSort(headCell.id)}
                    hideSortIcon={false}
                    aria-label={`Ordenar por ${headCell.label}`}
                    sx={{
                      "& .MuiTableSortLabel-icon": {
                        opacity: orderBy === headCell.id ? 1 : 0.3,
                      },
                    }}
                  >
                    {headCell.label}
                    {orderBy === headCell.id ? (
                      <Box
                        component="span"
                        sx={{
                          border: 0,
                          clip: "rect(0 0 0 0)",
                          height: "1px",
                          margin: -1,
                          overflow: "hidden",
                          padding: 0,
                          position: "absolute",
                          whiteSpace: "nowrap",
                          width: "1px",
                        }}
                      >
                        {order === "desc"
                          ? "sorted descending"
                          : "sorted ascending"}
                      </Box>
                    ) : null}
                  </TableSortLabel>
                ) : (
                  headCell.label
                )}
              </TableCell>
            ))}
              <TableCell
                sx={{
                  fontWeight: 600,
                  color: "grey.500",
                  fontSize: { xs: "0.75rem", sm: "0.875rem" },
                  px: { xs: 1, sm: 2 },
                  py: { xs: 1.5, sm: 2 },
                  width: 120,
                }}
              >
                Ações
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedCollaborators.map((collaborator) => (
              <TableRow
                key={collaborator.id}
                sx={{
                  "&:hover": {
                    backgroundColor: "action.hover",
                  },
                }}
              >
                <TableCell padding="checkbox" sx={{ py: { xs: 1.5, sm: 2 } }}>
                  <Checkbox
                    checked={selectedIds.has(collaborator.id)}
                    onChange={() => handleSelectOne(collaborator.id)}
                    aria-label={`Selecionar ${collaborator.name}`}
                    size="small"
                  />
                </TableCell>
                <TableCell sx={{ px: { xs: 1, sm: 2 }, py: { xs: 1.5, sm: 2 } }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: { xs: 1, sm: 1.5 },
                  }}
                >
                  <Avatar
                    {...stringAvatar(collaborator.name)}
                    alt={collaborator.name}
                    sx={{
                      ...stringAvatar(collaborator.name).sx,
                      width: { xs: 28, sm: 32 },
                      height: { xs: 28, sm: 32 },
                      fontSize: { xs: "0.75rem", sm: "0.875rem" },
                    }}
                  />
                  <span style={{ fontWeight: 500, fontSize: "inherit" }}>
                    {collaborator.name}
                  </span>
                </Box>
              </TableCell>
              <TableCell
                sx={{
                  color: "grey.500",
                  px: { xs: 1, sm: 2 },
                  py: { xs: 1.5, sm: 2 },
                  fontSize: { xs: "0.75rem", sm: "0.875rem" },
                }}
              >
                {collaborator.email}
              </TableCell>
              <TableCell
                sx={{
                  color: "grey.500",
                  px: { xs: 1, sm: 2 },
                  py: { xs: 1.5, sm: 2 },
                  fontSize: { xs: "0.75rem", sm: "0.875rem" },
                }}
              >
                {
                  departmentOptions.find(
                    (option) => option.value === collaborator.department,
                  )?.label
                }
              </TableCell>
              <TableCell
                sx={{
                  color: "grey.500",
                  px: { xs: 1, sm: 2 },
                  py: { xs: 1.5, sm: 2 },
                  fontSize: { xs: "0.75rem", sm: "0.875rem" },
                }}
              >
                {collaborator.occupation || "—"}
              </TableCell>
              <TableCell
                sx={{
                  color: "grey.500",
                  px: { xs: 1, sm: 2 },
                  py: { xs: 1.5, sm: 2 },
                  fontSize: { xs: "0.75rem", sm: "0.875rem" },
                }}
              >
                {levelOptions.find(
                  (option) => option.value === collaborator.level,
                )?.label ?? "—"}
              </TableCell>
              <TableCell
                sx={{
                  color: "grey.500",
                  px: { xs: 1, sm: 2 },
                  py: { xs: 1.5, sm: 2 },
                  fontSize: { xs: "0.75rem", sm: "0.875rem" },
                }}
              >
                {collaborator.startDate
                  ? dayjs(collaborator.startDate).format("DD/MM/YYYY")
                  : "—"}
              </TableCell>
              <TableCell
                sx={{
                  color: "grey.500",
                  px: { xs: 1, sm: 2 },
                  py: { xs: 1.5, sm: 2 },
                  fontSize: { xs: "0.75rem", sm: "0.875rem" },
                }}
              >
                {collaborator.managerId
                  ? (collaborators.find((c) => c.id === collaborator.managerId)
                      ?.name ?? "—")
                  : "—"}
              </TableCell>
              <TableCell
                sx={{
                  color: "grey.500",
                  px: { xs: 1, sm: 2 },
                  py: { xs: 1.5, sm: 2 },
                  fontSize: { xs: "0.75rem", sm: "0.875rem" },
                }}
              >
                {collaborator.baseSalary != null
                  ? new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(collaborator.baseSalary)
                  : "—"}
              </TableCell>
              <TableCell sx={{ px: { xs: 1, sm: 2 }, py: { xs: 1.5, sm: 2 } }}>
                <Chip
                  label={collaborator.isActive ? "Ativo" : "Inativo"}
                  size="small"
                  sx={{
                    fontWeight: 500,
                    fontSize: { xs: "0.625rem", sm: "0.75rem" },
                    height: { xs: 20, sm: 24 },
                    backgroundColor: collaborator.isActive
                      ? "success.light"
                      : "error.light",
                    color: collaborator.isActive
                      ? "success.main"
                      : "error.main",
                    border: "none",
                  }}
                />
              </TableCell>
              <TableCell
                sx={{
                  px: { xs: 1, sm: 2 },
                  py: { xs: 1.5, sm: 2 },
                  width: 120,
                }}
              >
                <Box sx={{ display: "flex", gap: 0.5 }}>
                  <IconButton
                    size="small"
                    onClick={() => setCollaboratorToEdit(collaborator)}
                    aria-label={`Editar ${collaborator.name}`}
                    color="primary"
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleDeleteClick(collaborator)}
                    aria-label={`Excluir ${collaborator.name}`}
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

      <Dialog
        open={deleteConfirm !== null}
        onClose={() => setDeleteConfirm(null)}
        aria-labelledby="delete-dialog-title"
        PaperProps={{ sx: { borderRadius: 2 } }}
      >
        <DialogTitle id="delete-dialog-title">
          {deleteConfirm?.ids.length === 1
            ? "Excluir colaborador?"
            : "Excluir colaboradores?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {deleteConfirm?.ids.length === 1 && deleteConfirm?.name
              ? `Tem certeza que deseja excluir "${deleteConfirm.name}"? Esta ação não pode ser desfeita.`
              : `Tem certeza que deseja excluir ${deleteConfirm?.ids.length ?? 0} colaboradores? Esta ação não pode ser desfeita.`}
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button
            onClick={() => setDeleteConfirm(null)}
            color="inherit"
            sx={{ textTransform: "none" }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
            disabled={isDeleting}
            sx={{ textTransform: "none" }}
          >
            {isDeleting ? "Excluindo…" : "Excluir"}
          </Button>
        </DialogActions>
      </Dialog>

      <EditCollaboratorModal
        open={collaboratorToEdit !== null}
        onClose={() => setCollaboratorToEdit(null)}
        collaborator={collaboratorToEdit}
      />
    </Box>
  );
}
