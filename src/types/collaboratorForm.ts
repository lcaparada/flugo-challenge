import type { Level } from "./collaborator";

export type CollaboratorFormData = {
  // Basic Info
  name: string;
  email: string;
  isActive: boolean;

  // Professional Info
  department: string;
  cargo: string;
  startDate: string;
  level: Level;
  managerId: string;
  baseSalary: string;
};

export const initialFormData: CollaboratorFormData = {
  name: "",
  email: "",
  isActive: true,
  department: "",
  cargo: "",
  startDate: "",
  level: "junior",
  managerId: "",
  baseSalary: "",
};
