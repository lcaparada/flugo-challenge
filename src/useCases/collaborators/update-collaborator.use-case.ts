import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { InfiniteData } from "@tanstack/react-query";
import {
  collaboratorsService,
  departmentsService,
  type PaginatedResult,
} from "@/services";
import type { Collaborator } from "@/types/collaborator";
import { QueryKeys } from "@/infra";

export type UpdateCollaboratorParams = {
  id: string;
  data: Partial<Omit<Collaborator, "id">>;
  previousDepartmentId?: string;
};

export function useUpdateCollaborator() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
      previousDepartmentId,
    }: UpdateCollaboratorParams) => {
      await collaboratorsService.update(id, data);
      const newDepartmentId = data.department;
      if (previousDepartmentId && previousDepartmentId !== newDepartmentId) {
        await departmentsService.removeCollaborator(previousDepartmentId, id);
      }
      if (newDepartmentId) {
        await departmentsService.addCollaborator(newDepartmentId, id);
      }
    },
    onSuccess: (_, { id, data }) => {
      queryClient.setQueryData<InfiniteData<PaginatedResult<Collaborator>>>(
        [QueryKeys.GetAllCollaborators],
        (old) => {
          if (!old) return old;
          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              data: page.data.map((c) =>
                c.id === id ? { ...c, ...data } as Collaborator : c,
              ),
            })),
          };
        },
      );
      queryClient.invalidateQueries({ queryKey: [QueryKeys.GetAllManagers] });
      queryClient.invalidateQueries({ queryKey: [QueryKeys.GetAllDepartments] });
    },
  });
}
