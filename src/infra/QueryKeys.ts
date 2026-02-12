export const QueryKeys = {
  GetAllCollaborators: "GetAllCollaborators",
  GetAllManagers: "GetAllManagers",
  GetAllDepartments: "GetAllDepartments",
} as const;

export type QueryKey = (typeof QueryKeys)[keyof typeof QueryKeys];
