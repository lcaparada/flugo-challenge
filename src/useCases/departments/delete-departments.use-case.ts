import { useMutation, useQueryClient } from "@tanstack/react-query";
import { departmentsService } from "@/services";
import { QueryKeys } from "@/infra";

export function useDeleteDepartments() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ids: string[]) =>
      ids.length === 1
        ? departmentsService.delete(ids[0])
        : departmentsService.deleteMany(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.GetAllDepartments] });
      queryClient.invalidateQueries({ queryKey: [QueryKeys.GetAllCollaborators] });
    },
  });
}
