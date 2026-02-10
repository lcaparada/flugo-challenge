import { z } from "zod";

export const createCollaboratorSchema = z.object({
  name: z.string().min(1),
  email: z.email(),
  isActive: z.boolean(),
  department: z.string().min(1),
});

export type CreateCollaboratorSchema = z.infer<typeof createCollaboratorSchema>;
