import {
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  startAfter,
  type QueryDocumentSnapshot,
  type DocumentData,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Collaborator } from "@/types/collaborator";

const COLLECTION_NAME = "collaborators";
const PAGE_SIZE = 10;

export type PaginatedResult<T> = {
  data: T[];
  lastDoc: QueryDocumentSnapshot<DocumentData> | null;
  hasMore: boolean;
};

export const collaboratorsService = {
  async getAll(
    pageParam?: QueryDocumentSnapshot<DocumentData>,
  ): Promise<PaginatedResult<Collaborator>> {
    const collaboratorsRef = collection(db, COLLECTION_NAME);

    let q = query(collaboratorsRef, orderBy("name"), limit(PAGE_SIZE + 1));

    if (pageParam) {
      q = query(
        collaboratorsRef,
        orderBy("name"),
        startAfter(pageParam),
        limit(PAGE_SIZE + 1),
      );
    }

    const snapshot = await getDocs(q);
    const docs = snapshot.docs;

    const hasMore = docs.length > PAGE_SIZE;
    const data = docs.slice(0, PAGE_SIZE);

    const collaborators = data.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Collaborator[];

    return {
      data: collaborators,
      lastDoc: data[data.length - 1] || null,
      hasMore,
    };
  },
};
