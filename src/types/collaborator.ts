export type Level = "junior" | "pleno" | "senior" | "gestor";

export type Collaborator = {
  id: string;
  name: string;
  email: string;
  department: string;
  isActive: boolean;
  occupation: string;
  startDate: string;
  level: Level;
  managerId: string;
  baseSalary?: number;
};
