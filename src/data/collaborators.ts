import type { Collaborator } from "../types/collaborator";

export const collaboratorsMock: Collaborator[] = [
  {
    id: "1",
    name: "Fernanda Torres",
    email: "fernandatorres@flugo.com",
    department: "Design",
    isActive: true,
  },
  {
    id: "2",
    name: "Joana D'Arc",
    email: "joanadarc@flugo.com",
    department: "TI",
    isActive: true,
  },
  {
    id: "3",
    name: "Mari Froes",
    email: "marifroes@flugo.com",
    department: "Marketing",
    isActive: true,
  },
  {
    id: "4",
    name: "Clara Costa",
    email: "claracosta@flugo.com",
    department: "Produto",
    isActive: false,
  },
];
