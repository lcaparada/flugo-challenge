import { useMemo, useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Alert,
} from "@mui/material";
import dayjs from "dayjs";
import {
  DatePickerForm,
  InputForm,
  SelectForm,
  SwitchForm,
} from "@/components";
import {
  createCollaboratorSchema,
  type CreateCollaboratorSchema,
} from "@/schemas";
import { useUpdateCollaborator, useGetAllManagers } from "@/useCases";
import { departmentOptions, levelOptions } from "@/constants";
import type { Collaborator } from "@/types/collaborator";

type EditCollaboratorModalProps = {
  open: boolean;
  onClose: () => void;
  collaborator: Collaborator | null;
};

export function EditCollaboratorModal({
  open,
  onClose,
  collaborator,
}: EditCollaboratorModalProps) {
  const {
    mutateAsync: updateCollaborator,
    isPending,
    isError,
    error,
  } = useUpdateCollaborator();
  const { managers } = useGetAllManagers();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateCollaboratorSchema>({
    resolver: zodResolver(createCollaboratorSchema),
    defaultValues: collaborator
      ? {
          name: collaborator.name,
          email: collaborator.email,
          isActive: collaborator.isActive,
          department: collaborator.department,
          occupation: collaborator.occupation,
          startDate: collaborator.startDate,
          level: collaborator.level,
          managerId: collaborator.managerId || "",
          baseSalary:
            collaborator.baseSalary != null
              ? String(collaborator.baseSalary).replace(".", ",")
              : "",
        }
      : undefined,
  });

  const level = useWatch({ control, name: "level", defaultValue: "junior" });

  const gestorOptions = useMemo(() => {
    if (!collaborator) return [];
    return managers
      .filter((c) => c.id !== collaborator.id)
      .map((c) => ({ value: c.id, label: c.name }));
  }, [managers, collaborator]);

  useEffect(() => {
    if (open && collaborator) {
      reset({
        name: collaborator.name,
        email: collaborator.email,
        isActive: collaborator.isActive,
        department: collaborator.department,
        occupation: collaborator.occupation,
        startDate: collaborator.startDate,
        level: collaborator.level,
        managerId: collaborator.managerId || "",
        baseSalary:
          collaborator.baseSalary != null
            ? String(collaborator.baseSalary).replace(".", ",")
            : "",
      });
    }
  }, [open, collaborator, reset]);

  const handleClose = () => {
    if (collaborator) {
      reset({
        name: collaborator.name,
        email: collaborator.email,
        isActive: collaborator.isActive,
        department: collaborator.department,
        occupation: collaborator.occupation,
        startDate: collaborator.startDate,
        level: collaborator.level,
        managerId: collaborator.managerId || "",
        baseSalary:
          collaborator.baseSalary != null
            ? String(collaborator.baseSalary).replace(".", ",")
            : "",
      });
    }
    onClose();
  };

  const onSubmit = async (data: CreateCollaboratorSchema) => {
    if (!collaborator) return;
    const baseSalaryNum = Number(String(data.baseSalary).replace(",", "."));
    await updateCollaborator({
      id: collaborator.id,
      data: {
        name: data.name,
        email: data.email,
        department: data.department,
        isActive: data.isActive,
        occupation: data.occupation,
        startDate: data.startDate,
        level: data.level,
        managerId: data.managerId ?? "",
        baseSalary: baseSalaryNum,
      },
    });
    handleClose();
  };

  if (!collaborator) return null;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 },
      }}
      aria-labelledby="edit-collaborator-dialog-title"
    >
      <DialogTitle id="edit-collaborator-dialog-title">
        Editar colaborador
      </DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent dividers>
          {isError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error?.message ?? "Erro ao atualizar colaborador."}
            </Alert>
          )}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
            <InputForm
              name="name"
              control={control}
              label="Nome"
              placeholder="João da Silva"
              error={!!errors.name}
              helperText={errors.name?.message}
            />
            <InputForm
              name="email"
              control={control}
              label="E-mail"
              type="email"
              placeholder="e.g. john@gmail.com"
              error={!!errors.email}
              helperText={errors.email?.message}
            />
            <SwitchForm name="isActive" control={control} label="Ativo" />
            <SelectForm
              name="department"
              control={control}
              label="Departamento"
              options={departmentOptions}
              error={!!errors.department}
              helperText={errors.department?.message}
            />
            <InputForm
              name="occupation"
              control={control}
              label="Cargo"
              placeholder="Ex.: Desenvolvedor Front-end"
              error={!!errors.occupation}
              helperText={errors.occupation?.message}
            />
            <DatePickerForm
              name="startDate"
              control={control}
              label="Data de admissão"
              maxDate={dayjs()}
              error={!!errors.startDate}
              helperText={errors.startDate?.message}
            />
            <SelectForm
              name="level"
              control={control}
              label="Nível hierárquico"
              options={levelOptions}
              error={!!errors.level}
              helperText={errors.level?.message}
            />
            {level !== "gestor" && (
              <SelectForm
                name="managerId"
                control={control}
                label="Gestor responsável"
                options={[{ value: "", label: "Nenhum" }, ...gestorOptions]}
                error={!!errors.managerId}
                helperText={errors.managerId?.message}
              />
            )}
            <InputForm
              name="baseSalary"
              control={control}
              label="Salário base (R$)"
              type="number"
              inputMode="decimal"
              placeholder="0,00"
              error={!!errors.baseSalary}
              helperText={errors.baseSalary?.message}
              slotProps={{
                input: { inputProps: { min: 0, step: 0.01 } },
              }}
            />
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
            disabled={isPending}
            loading={isPending}
            sx={{ textTransform: "none" }}
          >
            Salvar
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
