import { describe, it, expect, vi, beforeEach } from "vitest";
import { departmentsService } from "../departments.service";
import type { Department } from "@/types/department";

const mockGetDocs = vi.fn();
const mockGetDoc = vi.fn();
const mockAddDoc = vi.fn();
const mockUpdateDoc = vi.fn();
const mockDeleteDoc = vi.fn();
const mockBatchDelete = vi.fn();
const mockBatchCommit = vi.fn();

vi.mock("@/lib/firebase", () => ({
  db: {},
}));

vi.mock("firebase/firestore", () => ({
  collection: vi.fn((_db: unknown, name: string) => ({ _collection: name })),
  doc: vi.fn((_db: unknown, coll: string, id: string) => ({
    _doc: [coll, id],
  })),
  query: vi.fn((...args: unknown[]) => ({ _query: args })),
  orderBy: vi.fn((field: string) => ({ _orderBy: field })),
  getDocs: (...args: unknown[]) => mockGetDocs(...args),
  getDoc: (...args: unknown[]) => mockGetDoc(...args),
  addDoc: (...args: unknown[]) => mockAddDoc(...args),
  updateDoc: (...args: unknown[]) => mockUpdateDoc(...args),
  deleteDoc: (...args: unknown[]) => mockDeleteDoc(...args),
  writeBatch: vi.fn(() => ({
    delete: (...args: unknown[]) => mockBatchDelete(...args),
    commit: () => mockBatchCommit(),
  })),
  arrayUnion: vi.fn((value: unknown) => ({ _arrayUnion: value })),
  arrayRemove: vi.fn((value: unknown) => ({ _arrayRemove: value })),
}));

function createMockDeptDoc(
  id: string,
  data: Omit<Department, "id">,
): { id: string; data: () => Department } {
  return {
    id,
    data: () => ({ ...data, id }),
  };
}

describe("departmentsService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getAll", () => {
    it("returns departments ordered by name", async () => {
      const mockDocs = [
        createMockDeptDoc("d1", {
          name: "Engenharia",
          collaboratorIds: ["c1"],
          managerId: "c1",
        }),
        createMockDeptDoc("d2", {
          name: "Marketing",
          collaboratorIds: [],
          managerId: "",
        }),
      ];
      mockGetDocs.mockResolvedValueOnce({ docs: mockDocs });

      const result = await departmentsService.getAll();

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        id: "d1",
        name: "Engenharia",
        collaboratorIds: ["c1"],
        managerId: "c1",
      });
      expect(result[1]).toEqual({
        id: "d2",
        name: "Marketing",
        collaboratorIds: [],
        managerId: "",
      });
      expect(mockGetDocs).toHaveBeenCalledTimes(1);
    });

    it("returns empty array when no departments", async () => {
      mockGetDocs.mockResolvedValueOnce({ docs: [] });

      const result = await departmentsService.getAll();

      expect(result).toHaveLength(0);
    });

    it("calls query with orderBy name", async () => {
      mockGetDocs.mockResolvedValueOnce({ docs: [] });
      const { query, orderBy } = await import("firebase/firestore");

      await departmentsService.getAll();

      expect(orderBy).toHaveBeenCalledWith("name");
      expect(query).toHaveBeenCalled();
    });
  });

  describe("getById", () => {
    it("returns department when document exists", async () => {
      const mockSnapshot = {
        exists: () => true,
        id: "dept-1",
        data: () => ({
          name: "RH",
          collaboratorIds: ["c1", "c2"],
          managerId: "c1",
        }),
      };
      mockGetDoc.mockResolvedValueOnce(mockSnapshot);

      const result = await departmentsService.getById("dept-1");

      expect(result).toEqual({
        id: "dept-1",
        name: "RH",
        collaboratorIds: ["c1", "c2"],
        managerId: "c1",
      });
      expect(mockGetDoc).toHaveBeenCalledTimes(1);
    });

    it("returns null when document does not exist", async () => {
      mockGetDoc.mockResolvedValueOnce({ exists: () => false });

      const result = await departmentsService.getById("inexistente");

      expect(result).toBeNull();
    });

    it("calls getDoc with correct doc ref", async () => {
      mockGetDoc.mockResolvedValueOnce({ exists: () => false });
      const { doc } = await import("firebase/firestore");

      await departmentsService.getById("my-id");

      expect(doc).toHaveBeenCalledWith(expect.anything(), "departments", "my-id");
    });
  });

  describe("create", () => {
    it("creates department and returns new doc id", async () => {
      mockAddDoc.mockResolvedValueOnce({ id: "new-dept-id" });

      const data: Omit<Department, "id"> = {
        name: "Design",
        collaboratorIds: [],
        managerId: "",
      };

      const id = await departmentsService.create(data);

      expect(id).toBe("new-dept-id");
      expect(mockAddDoc).toHaveBeenCalledTimes(1);
      expect(mockAddDoc).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          name: "Design",
          collaboratorIds: [],
          managerId: "",
        }),
      );
    });

    it("defaults collaboratorIds to empty array when not provided", async () => {
      mockAddDoc.mockResolvedValueOnce({ id: "new-id" });

      await departmentsService.create({
        name: "Vendas",
        managerId: "m1",
      } as Omit<Department, "id">);

      expect(mockAddDoc).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          name: "Vendas",
          managerId: "m1",
          collaboratorIds: [],
        }),
      );
    });
  });

  describe("update", () => {
    it("calls updateDoc with correct doc ref and data", async () => {
      mockUpdateDoc.mockResolvedValueOnce(undefined);

      await departmentsService.update("dept-123", {
        name: "Engenharia de Software",
        managerId: "c2",
      });

      const { doc } = await import("firebase/firestore");
      expect(doc).toHaveBeenCalledWith(expect.anything(), "departments", "dept-123");
      expect(mockUpdateDoc).toHaveBeenCalledTimes(1);
      expect(mockUpdateDoc).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          name: "Engenharia de Software",
          managerId: "c2",
        }),
      );
    });
  });

  describe("addCollaborator", () => {
    it("calls updateDoc with arrayUnion for collaboratorId", async () => {
      mockUpdateDoc.mockResolvedValueOnce(undefined);
      const { doc, arrayUnion } = await import("firebase/firestore");

      await departmentsService.addCollaborator("dept-1", "collab-1");

      expect(doc).toHaveBeenCalledWith(expect.anything(), "departments", "dept-1");
      expect(arrayUnion).toHaveBeenCalledWith("collab-1");
      expect(mockUpdateDoc).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          collaboratorIds: { _arrayUnion: "collab-1" },
        }),
      );
    });
  });

  describe("removeCollaborator", () => {
    it("calls updateDoc with arrayRemove for collaboratorId", async () => {
      mockUpdateDoc.mockResolvedValueOnce(undefined);
      const { doc, arrayRemove } = await import("firebase/firestore");

      await departmentsService.removeCollaborator("dept-1", "collab-1");

      expect(doc).toHaveBeenCalledWith(expect.anything(), "departments", "dept-1");
      expect(arrayRemove).toHaveBeenCalledWith("collab-1");
      expect(mockUpdateDoc).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          collaboratorIds: { _arrayRemove: "collab-1" },
        }),
      );
    });
  });

  describe("delete", () => {
    it("calls deleteDoc with correct doc ref", async () => {
      mockDeleteDoc.mockResolvedValueOnce(undefined);
      const { doc } = await import("firebase/firestore");

      await departmentsService.delete("dept-to-delete");

      expect(doc).toHaveBeenCalledWith(
        expect.anything(),
        "departments",
        "dept-to-delete",
      );
      expect(mockDeleteDoc).toHaveBeenCalledTimes(1);
    });

    it("resolves when deleteDoc succeeds", async () => {
      mockDeleteDoc.mockResolvedValueOnce(undefined);

      await expect(
        departmentsService.delete("any-id"),
      ).resolves.toBeUndefined();
    });
  });

  describe("deleteMany", () => {
    it("does not call writeBatch or commit when ids is empty", async () => {
      const { writeBatch } = await import("firebase/firestore");

      await departmentsService.deleteMany([]);

      expect(writeBatch).not.toHaveBeenCalled();
      expect(mockBatchDelete).not.toHaveBeenCalled();
      expect(mockBatchCommit).not.toHaveBeenCalled();
    });

    it("calls batch.delete for each id and batch.commit when ids provided", async () => {
      mockBatchCommit.mockResolvedValueOnce(undefined);
      const { writeBatch, doc } = await import("firebase/firestore");

      await departmentsService.deleteMany(["id1", "id2"]);

      expect(writeBatch).toHaveBeenCalledTimes(1);
      expect(mockBatchDelete).toHaveBeenCalledTimes(2);
      expect(doc).toHaveBeenCalledWith(expect.anything(), "departments", "id1");
      expect(doc).toHaveBeenCalledWith(expect.anything(), "departments", "id2");
      expect(mockBatchCommit).toHaveBeenCalledTimes(1);
    });

    it("resolves when batch.commit succeeds", async () => {
      mockBatchCommit.mockResolvedValueOnce(undefined);

      await expect(
        departmentsService.deleteMany(["a", "b"]),
      ).resolves.toBeUndefined();
    });
  });
});
