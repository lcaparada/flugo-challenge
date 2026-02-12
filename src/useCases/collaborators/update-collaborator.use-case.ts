import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { InfiniteData } from "@tanstack/react-query";
import { collaboratorsService, type PaginatedResult } from "@/services";
import type { Collaborator } from "@/types/collaborator";
import { QueryKeys } from "@/infra";

export function useUpdateCollaborator() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<Omit<Collaborator, "id">>;
    }) => collaboratorsService.update(id, data),
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
    },
  });
}
