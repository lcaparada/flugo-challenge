import { useQuery } from "@tanstack/react-query";
import { collaboratorsService } from "@/services";
import type { Collaborator } from "@/types/collaborator";
import { QueryKeys } from "@/infra";

export function useGetAllManagers() {
  const { data: managers = [], isLoading } = useQuery<Collaborator[], Error>({
    queryKey: [QueryKeys.GetAllManagers],
    queryFn: () => collaboratorsService.getAllManagers(),
  });

  return {
    managers,
    isLoadingManagers: isLoading,
  };
}
