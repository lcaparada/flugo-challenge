import {
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  startAfter,
  addDoc,
  where,
  type QueryDocumentSnapshot,
  type DocumentData,
} from "firebase/firestore";
import { createEmailAlreadyExistsError } from "@/infra";
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

  async create(data: Omit<Collaborator, "id">): Promise<string> {
    const collaboratorsRef = collection(db, COLLECTION_NAME);
    const emailQuery = query(
      collaboratorsRef,
      where("email", "==", data.email),
      limit(1),
    );
    const existing = await getDocs(emailQuery);
    if (!existing.empty) {
      throw createEmailAlreadyExistsError(data.email);
    }
    const docRef = await addDoc(collaboratorsRef, data);
    return docRef.id;
  },
};
