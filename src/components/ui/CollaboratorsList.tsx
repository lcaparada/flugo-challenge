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
import { stringAvatar } from "@/utils/avatar";
import { EmptyState } from "@/components/ui/EmptyState";
import type { Collaborator } from "@/types/collaborator";
import { departmentOptions } from "@/constants";

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
  { id: "isActive", label: "Status", sortable: true },
];

export function CollaboratorsList({
  collaborators,
  emptyStateAction,
}: CollaboratorsListProps) {
  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState<CollaboratorKey>("name");

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
                    src={collaborator.avatarUrl}
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
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
