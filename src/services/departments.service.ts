import {
  collection,
  doc,
  getDoc,
  query,
  orderBy,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  writeBatch,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Department } from "@/types/department";

const COLLECTION_NAME = "departments";

export const departmentsService = {
  async getAll(): Promise<Department[]> {
    const ref = collection(db, COLLECTION_NAME);
    const q = query(ref, orderBy("name"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    })) as Department[];
  },

  async getById(id: string): Promise<Department | null> {
    const ref = doc(db, COLLECTION_NAME, id);
    const snapshot = await getDoc(ref);
    if (!snapshot.exists()) return null;
    return { id: snapshot.id, ...snapshot.data() } as Department;
  },

  async create(data: Omit<Department, "id">): Promise<string> {
    const ref = collection(db, COLLECTION_NAME);
    const payload = {
      ...data,
      collaboratorIds: data.collaboratorIds ?? [],
    };
    const docRef = await addDoc(ref, payload);
    return docRef.id;
  },

  async update(
    id: string,
    data: Partial<Omit<Department, "id">>,
  ): Promise<void> {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, data as Record<string, unknown>);
  },

  async addCollaborator(departmentId: string, collaboratorId: string): Promise<void> {
    const docRef = doc(db, COLLECTION_NAME, departmentId);
    await updateDoc(docRef, {
      collaboratorIds: arrayUnion(collaboratorId),
    } as Record<string, unknown>);
  },

  async removeCollaborator(departmentId: string, collaboratorId: string): Promise<void> {
    const docRef = doc(db, COLLECTION_NAME, departmentId);
    await updateDoc(docRef, {
      collaboratorIds: arrayRemove(collaboratorId),
    } as Record<string, unknown>);
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
