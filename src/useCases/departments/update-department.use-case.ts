import { useMutation, useQueryClient } from "@tanstack/react-query";
import { departmentsService, collaboratorsService } from "@/services";
import type { Department } from "@/types/department";
import { QueryKeys } from "@/infra";

export function useUpdateDepartment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
      removedTransfers,
    }: {
      id: string;
      data: Partial<Omit<Department, "id">>;
      removedTransfers?: { collaboratorId: string; newDepartmentId: string }[];
    }) => {
      await departmentsService.update(id, data);
      const collaboratorIds = data.collaboratorIds ?? [];
      for (const collabId of collaboratorIds) {
        const collaborator = await collaboratorsService.getById(collabId);
        const previousDeptId = collaborator?.department;
        if (previousDeptId && previousDeptId !== id) {
          await departmentsService.removeCollaborator(previousDeptId, collabId);
        }
        await collaboratorsService.update(collabId, { department: id });
      }
      for (const { collaboratorId, newDepartmentId } of removedTransfers ?? []) {
        await collaboratorsService.update(collaboratorId, {
          department: newDepartmentId,
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.GetAllDepartments] });
      queryClient.invalidateQueries({ queryKey: [QueryKeys.GetAllCollaborators] });
    },
  });
}
