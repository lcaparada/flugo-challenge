export const QueryKeys = {
  GetAllCollaborators: "GetAllCollaborators",
} as const;

export type QueryKey = (typeof QueryKeys)[keyof typeof QueryKeys];
