export type CollaboratorFormData = {
  // Basic Info
  name: string;
  email: string;
  isActive: boolean;

  // Professional Info
  department: string;
  role: string;
  salary: string;
  startDate: string;
};

export const initialFormData: CollaboratorFormData = {
  name: "",
  email: "",
  isActive: true,
  department: "",
  role: "",
  salary: "",
  startDate: "",
};
