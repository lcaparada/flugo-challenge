import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  departmentsService,
  collaboratorsService,
} from "@/services";
import type { Department } from "@/types/department";
import { QueryKeys } from "@/infra";

export function useCreateDepartment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Omit<Department, "id">) => {
      const id = await departmentsService.create(data);
      for (const collabId of data.collaboratorIds ?? []) {
        const collaborator = await collaboratorsService.getById(collabId);
        const previousDeptId = collaborator?.department;
        if (previousDeptId && previousDeptId !== id) {
          await departmentsService.removeCollaborator(previousDeptId, collabId);
        }
        await collaboratorsService.update(collabId, {
          department: id,
        });
      }
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.GetAllDepartments] });
      queryClient.invalidateQueries({ queryKey: [QueryKeys.GetAllCollaborators] });
    },
  });
}
