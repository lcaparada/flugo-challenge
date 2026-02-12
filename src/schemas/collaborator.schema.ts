import { levelOptions } from "@/constants";
import { z } from "zod";

export const createCollaboratorSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  email: z.email("E-mail inválido"),
  isActive: z.boolean(),
  department: z.string().min(1, "Departamento é obrigatório"),
  occupation: z.string().min(1, "Cargo é obrigatório"),
  startDate: z.string().min(1, "Data de admissão é obrigatória"),
  level: z.enum(levelOptions.map((option) => option.value)),
  managerId: z.string().optional(),
  baseSalary: z
    .string()
    .min(1, "Salário base é obrigatório")
    .refine((s) => {
      const n = Number(s.replace(",", "."));
      return !Number.isNaN(n) && n >= 0;
    }, "Informe um valor numérico válido"),
});

export type CreateCollaboratorSchema = z.infer<typeof createCollaboratorSchema>;
