import { useInfiniteQuery } from "@tanstack/react-query";
import type { InfiniteData } from "@tanstack/react-query";
import type { QueryDocumentSnapshot, DocumentData } from "firebase/firestore";
import { collaboratorsService, type PaginatedResult } from "@/services";
import type { Collaborator } from "@/types/collaborator";
import { QueryKeys } from "@/infra";

export function useGetAllCollaborators() {
  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery<
    PaginatedResult<Collaborator>,
    Error,
    InfiniteData<PaginatedResult<Collaborator>>,
    [QueryKeys],
    QueryDocumentSnapshot<DocumentData> | undefined
  >({
    queryKey: [QueryKeys.GetAllCollaborators],
    queryFn: async ({ pageParam }) => {
      const result = await collaboratorsService.getAll(pageParam);
      return result;
    },
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.lastDoc : undefined,
    initialPageParam: undefined,
  });

  return {
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    allCollaborators: data?.pages?.flatMap((page) => page.data) ?? [],
  };
}
