import { useQuery } from "@tanstack/react-query";
import { departmentsService } from "@/services";
import type { Department } from "@/types/department";
import { QueryKeys } from "@/infra";

export function useGetAllDepartments() {
  const { data: departments = [], ...rest } = useQuery<Department[], Error>({
    queryKey: [QueryKeys.GetAllDepartments],
    queryFn: () => departmentsService.getAll(),
  });

  return {
    departments,
    ...rest,
  };
}
