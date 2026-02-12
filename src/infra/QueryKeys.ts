export const QueryKeys = {
  GetAllCollaborators: "GetAllCollaborators",
  GetAllManagers: "GetAllManagers",
} as const;

export type QueryKey = (typeof QueryKeys)[keyof typeof QueryKeys];
