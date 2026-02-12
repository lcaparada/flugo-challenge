import {
  collection,
  doc,
  getDoc,
  query,
  orderBy,
  limit,
  getDocs,
  startAfter,
  addDoc,
  updateDoc,
  deleteDoc,
  writeBatch,
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

  async getById(id: string): Promise<Collaborator | null> {
    const docRef = doc(db, COLLECTION_NAME, id);
    const snapshot = await getDoc(docRef);
    if (!snapshot.exists()) return null;
    return { id: snapshot.id, ...snapshot.data() } as Collaborator;
  },

  async getAllManagers(): Promise<Collaborator[]> {
    const collaboratorsRef = collection(db, COLLECTION_NAME);
    const q = query(
      collaboratorsRef,
      where("level", "==", "gestor"),
    );
    const snapshot = await getDocs(q);
    const collaborators = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Collaborator[];
    return collaborators.sort((a, b) => a.name.localeCompare(b.name));
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
    const payload = {
      ...data,
      baseSalary: data.baseSalary != null ? Number(data.baseSalary) : undefined,
    };
    const docRef = await addDoc(collaboratorsRef, payload);
    return docRef.id;
  },

  async update(
    id: string,
    data: Partial<Omit<Collaborator, "id">>,
  ): Promise<void> {
    if (data.email != null) {
      const collaboratorsRef = collection(db, COLLECTION_NAME);
      const emailQuery = query(
        collaboratorsRef,
        where("email", "==", data.email),
        limit(2),
      );
      const existing = await getDocs(emailQuery);
      const otherWithSameEmail = existing.docs.find((d) => d.id !== id);
      if (otherWithSameEmail) {
        throw createEmailAlreadyExistsError(data.email);
      }
    }
    const docRef = doc(db, COLLECTION_NAME, id);
    const payload = { ...data } as Record<string, unknown>;
    if (payload.baseSalary != null) {
      payload.baseSalary = Number(payload.baseSalary);
    }
    await updateDoc(docRef, payload);
  },

  async delete(id: string): Promise<void> {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
  },

  async deleteMany(ids: string[]): Promise<void> {
    if (ids.length === 0) return;
    const batch = writeBatch(db);
    for (const id of ids) {
      const docRef = doc(db, COLLECTION_NAME, id);
      batch.delete(docRef);
    }
    await batch.commit();
  },
};
