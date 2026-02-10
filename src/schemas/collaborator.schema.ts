import { z } from "zod";

export const createCollaboratorSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  email: z.email("E-mail inválido"),
  isActive: z.boolean(),
  department: z.string().min(1, "Departamento é obrigatório"),
});

export type CreateCollaboratorSchema = z.infer<typeof createCollaboratorSchema>;
