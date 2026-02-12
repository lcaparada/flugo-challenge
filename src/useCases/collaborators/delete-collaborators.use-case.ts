import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { InfiniteData } from "@tanstack/react-query";
import { collaboratorsService, type PaginatedResult } from "@/services";
import type { Collaborator } from "@/types/collaborator";
import { QueryKeys } from "@/infra";

export function useDeleteCollaborators() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ids: string[]) =>
      ids.length === 1
        ? collaboratorsService.delete(ids[0])
        : collaboratorsService.deleteMany(ids),
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
    },
  });
}
