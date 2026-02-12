import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Alert,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Typography,
  type SelectChangeEvent,
} from "@mui/material";
import type { Department } from "@/types/department";
import type { Collaborator } from "@/types/collaborator";
import { useCreateDepartment, useUpdateDepartment } from "@/useCases";

type DepartmentFormModalProps = {
  open: boolean;
  onClose: () => void;
  department: Department | null;
  collaborators: Collaborator[];
  departments: Department[];
};

export function DepartmentFormModal({
  open,
  onClose,
  department,
  collaborators,
  departments,
}: DepartmentFormModalProps) {
  const isEdit = !!department;

  const [name, setName] = useState(() => department?.name ?? "");
  const [managerId, setManagerId] = useState(() => department?.managerId ?? "");
  const [collaboratorIds, setCollaboratorIds] = useState<string[]>(
    () => department?.collaboratorIds ?? [],
  );
  const [removedTransfers, setRemovedTransfers] = useState<
    { collaboratorId: string; newDepartmentId: string }[]
  >([]);
  const [transferDialog, setTransferDialog] = useState<{
    collaboratorId: string;
    collaboratorName: string;
  } | null>(null);
  const [transferTargetId, setTransferTargetId] = useState("");

  const {
    mutateAsync: createDepartment,
    isPending: isCreating,
    isError: isCreateError,
    error: createError,
  } = useCreateDepartment();
  const {
    mutateAsync: updateDepartment,
    isPending: isUpdating,
    isError: isUpdateError,
    error: updateError,
  } = useUpdateDepartment();

  const isPending = isCreating || isUpdating;
  const isError = isCreateError || isUpdateError;
  const error = createError ?? updateError;

  const handleClose = () => {
    onClose();
  };

  const availableToAdd = collaborators.filter(
    (c) => !collaboratorIds.includes(c.id),
  );
  const departmentsForTransfer = departments.filter(
    (d) => d.id !== department?.id,
  );

  const handleAddCollaborator = (collabId: string) => {
    if (!collaboratorIds.includes(collabId)) {
      setCollaboratorIds((prev) => [...prev, collabId]);
    }
  };

  const handleRemoveCollaborator = (collabId: string) => {
    if (!isEdit) {
      setCollaboratorIds((prev) => prev.filter((id) => id !== collabId));
      return;
    }
    const collab = collaborators.find((c) => c.id === collabId);
    setTransferDialog({
      collaboratorId: collabId,
      collaboratorName: collab?.name ?? "",
    });
    setTransferTargetId(departmentsForTransfer[0]?.id ?? "");
  };

  const confirmTransfer = () => {
    if (!transferDialog || !transferTargetId) return;
    setRemovedTransfers((prev) => [
      ...prev,
      {
        collaboratorId: transferDialog.collaboratorId,
        newDepartmentId: transferTargetId,
      },
    ]);
    setCollaboratorIds((prev) =>
      prev.filter((id) => id !== transferDialog.collaboratorId),
    );
    setTransferDialog(null);
    setTransferTargetId("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (isEdit && department) {
      await updateDepartment({
        id: department.id,
        data: {
          name: name.trim(),
          managerId: managerId || "",
          collaboratorIds,
        },
        removedTransfers:
          removedTransfers.length > 0 ? removedTransfers : undefined,
      });
    } else {
      await createDepartment({
        name: name.trim(),
        managerId: managerId || "",
        collaboratorIds,
      });
    }
    handleClose();
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 2 } }}
        aria-labelledby="department-form-dialog-title"
      >
        <DialogTitle id="department-form-dialog-title">
          {isEdit ? "Editar departamento" : "Novo departamento"}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent dividers>
            {isError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error?.message ?? "Erro ao salvar departamento."}
              </Alert>
            )}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
              <TextField
                label="Nome"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                fullWidth
                size="small"
                placeholder="Ex.: Engenharia"
                error={!name.trim()}
                helperText={!name.trim() ? "Nome é obrigatório" : undefined}
              />
              <FormControl fullWidth size="small">
                <InputLabel id="department-manager-label" shrink>
                  Gestor responsável
                </InputLabel>
                <Select
                  labelId="department-manager-label"
                  label="Gestor responsável"
                  value={managerId}
                  onChange={(e: SelectChangeEvent) =>
                    setManagerId(e.target.value)
                  }
                  displayEmpty
                >
                  <MenuItem value="">Nenhum</MenuItem>
                  {collaborators
                    .filter((c) => c.level === "gestor")
                    .map((c) => (
                      <MenuItem key={c.id} value={c.id}>
                        {c.name}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>

              <Box>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  sx={{ mb: 1 }}
                >
                  Colaboradores
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 1 }}>
                  {collaboratorIds.length > 0 ? (
                    collaboratorIds.map((id) => {
                      const c = collaborators.find((x) => x.id === id);
                      return (
                        <Chip
                          key={id}
                          label={c?.name ?? id}
                          size="small"
                          onDelete={() => handleRemoveCollaborator(id)}
                        />
                      );
                    })
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      Nenhum colaborador adicionado
                    </Typography>
                  )}
                </Box>
                {availableToAdd.length > 0 && (
                  <FormControl size="small" fullWidth sx={{ mt: 2 }}>
                    <InputLabel id="add-collab-label" shrink>
                      Adicionar colaborador
                    </InputLabel>
                    <Select
                      labelId="add-collab-label"
                      label="Adicionar colaborador"
                      value=""
                      onChange={(e: SelectChangeEvent) => {
                        const v = e.target.value;
                        if (v) handleAddCollaborator(v);
                      }}
                      displayEmpty
                    >
                      <MenuItem value="">Selecione...</MenuItem>
                      {availableToAdd.map((c) => (
                        <MenuItem key={c.id} value={c.id}>
                          {c.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              </Box>
            </Box>
          </DialogContent>
          <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
            <Button
              onClick={handleClose}
              color="inherit"
              sx={{ textTransform: "none" }}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={isPending || !name.trim()}
              sx={{ textTransform: "none" }}
              loading={isPending}
            >
              {isEdit ? "Salvar" : "Criar"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <Dialog
        open={!!transferDialog}
        onClose={() => setTransferDialog(null)}
        maxWidth="xs"
        fullWidth
        slotProps={{
          paper: {
            sx: { borderRadius: 2 },
          },
        }}
      >
        <DialogTitle>Transferir colaborador</DialogTitle>
        <DialogContent>
          {transferDialog && (
            <>
              <Typography sx={{ mb: 2 }}>
                Transferir <strong>{transferDialog.collaboratorName}</strong>{" "}
                para qual departamento?
              </Typography>
              <FormControl fullWidth size="small">
                <InputLabel id="transfer-target-label">Departamento</InputLabel>
                <Select
                  labelId="transfer-target-label"
                  label="Departamento"
                  value={transferTargetId}
                  onChange={(e: SelectChangeEvent) =>
                    setTransferTargetId(e.target.value)
                  }
                >
                  {departmentsForTransfer.map((d) => (
                    <MenuItem key={d.id} value={d.id}>
                      {d.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button
            onClick={() => setTransferDialog(null)}
            color="inherit"
            sx={{ textTransform: "none" }}
          >
            Cancelar
          </Button>
          <Button
            onClick={confirmTransfer}
            variant="contained"
            disabled={!transferTargetId}
            sx={{ textTransform: "none" }}
          >
            Transferir
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
