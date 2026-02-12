import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { InfiniteData } from "@tanstack/react-query";
import {
  collaboratorsService,
  departmentsService,
  type PaginatedResult,
} from "@/services";
import type { Collaborator } from "@/types/collaborator";
import { QueryKeys } from "@/infra";

export type CreateCollaboratorParams = Omit<Collaborator, "id">;

export function useCreateCollaborator() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Omit<Collaborator, "id">) => {
      const newId = await collaboratorsService.create(data);
      if (data.department) {
        await departmentsService.addCollaborator(data.department, newId);
      }
      return newId;
    },
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
      if (variables.department) {
        queryClient.invalidateQueries({ queryKey: [QueryKeys.GetAllDepartments] });
      }
    },
  });
}
