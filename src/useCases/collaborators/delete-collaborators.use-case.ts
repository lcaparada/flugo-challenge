import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { InfiniteData } from "@tanstack/react-query";
import {
  collaboratorsService,
  departmentsService,
  type PaginatedResult,
} from "@/services";
import type { Collaborator } from "@/types/collaborator";
import { QueryKeys } from "@/infra";

export function useDeleteCollaborators() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (ids: string[]) => {
      for (const id of ids) {
        const collaborator = await collaboratorsService.getById(id);
        if (collaborator?.department) {
          await departmentsService.removeCollaborator(collaborator.department, id);
        }
      }
      if (ids.length === 1) {
        await collaboratorsService.delete(ids[0]);
      } else {
        await collaboratorsService.deleteMany(ids);
      }
    },
    onSuccess: (_data, ids) => {
      const idSet = new Set(ids);
      queryClient.setQueryData<InfiniteData<PaginatedResult<Collaborator>>>(
        [QueryKeys.GetAllCollaborators],
        (old) => {
          if (!old) return old;
          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              data: page.data.filter((c) => !idSet.has(c.id)),
            })),
          };
        },
      );
      queryClient.invalidateQueries({ queryKey: [QueryKeys.GetAllManagers] });
      queryClient.invalidateQueries({ queryKey: [QueryKeys.GetAllDepartments] });
    },
  });
}
