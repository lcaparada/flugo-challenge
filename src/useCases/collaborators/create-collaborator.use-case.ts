import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { InfiniteData } from "@tanstack/react-query";
import { collaboratorsService, type PaginatedResult } from "@/services";
import type { Collaborator } from "@/types/collaborator";
import { QueryKeys } from "@/infra";

export function useCreateCollaborator() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Omit<Collaborator, "id">) =>
      collaboratorsService.create(data),
    onSuccess: (newId, variables) => {
      const newCollaborator: Collaborator = { id: newId, ...variables };

      queryClient.setQueryData<InfiniteData<PaginatedResult<Collaborator>>>(
        [QueryKeys.GetAllCollaborators],
        (old) => {
          if (!old) return old;
          const [firstPage, ...restPages] = old.pages;
          return {
            ...old,
            pages: [
              { ...firstPage, data: [newCollaborator, ...firstPage.data] },
              ...restPages,
            ],
          };
        },
      );
    },
  });
}
