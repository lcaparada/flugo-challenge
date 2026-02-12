import { describe, it, expect, vi, beforeEach } from "vitest";
import type { QueryDocumentSnapshot, DocumentData } from "firebase/firestore";
import { collaboratorsService } from "../collaborators.service";
import type { Collaborator } from "@/types/collaborator";

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
  limit: vi.fn((n: number) => ({ _limit: n })),
  startAfter: vi.fn((doc: unknown) => ({ _startAfter: doc })),
  where: vi.fn((field: string, op: string, value: unknown) => ({
    _where: [field, op, value],
  })),
  getDocs: (...args: unknown[]) => mockGetDocs(...args),
  getDoc: (...args: unknown[]) => mockGetDoc(...args),
  addDoc: (...args: unknown[]) => mockAddDoc(...args),
  updateDoc: (...args: unknown[]) => mockUpdateDoc(...args),
  deleteDoc: (...args: unknown[]) => mockDeleteDoc(...args),
  writeBatch: vi.fn(() => ({
    delete: (...args: unknown[]) => mockBatchDelete(...args),
    commit: () => mockBatchCommit(),
  })),
}));

function createMockDoc(
  id: string,
  data: Partial<Omit<Collaborator, "id">> & {
    name: string;
    email: string;
    department: string;
    isActive: boolean;
  },
): { id: string; data: () => Record<string, unknown> } {
  return {
    id,
    data: () => data,
  };
}

describe("collaboratorsService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getAll", () => {
    it("returns first page with data and hasMore when more than PAGE_SIZE exist", async () => {
      const PAGE_SIZE = 10;
      const mockDocs = Array.from({ length: PAGE_SIZE + 1 }, (_, i) =>
        createMockDoc(String(i + 1), {
          name: `User ${i + 1}`,
          email: `user${i + 1}@x.com`,
          department: "TI",
          isActive: true,
        }),
      );
      mockGetDocs.mockResolvedValueOnce({
        docs: mockDocs,
        empty: false,
      });

      const result = await collaboratorsService.getAll();

      expect(result.data).toHaveLength(PAGE_SIZE);
      expect(result.data[0]).toEqual({
        id: "1",
        name: "User 1",
        email: "user1@x.com",
        department: "TI",
        isActive: true,
      });
      expect(result.hasMore).toBe(true);
      expect(result.lastDoc).toBe(mockDocs[PAGE_SIZE - 1]);
    });

    it("returns first page with hasMore false when PAGE_SIZE or less", async () => {
      const mockDocs = [
        createMockDoc("1", {
          name: "Ana",
          email: "ana@x.com",
          department: "TI",
          isActive: true,
        }),
      ];
      mockGetDocs.mockResolvedValueOnce({ docs: mockDocs, empty: false });

      const result = await collaboratorsService.getAll();

      expect(result.data).toHaveLength(1);
      expect(result.hasMore).toBe(false);
      expect(result.lastDoc).toBe(mockDocs[0]);
    });

    it("returns empty list when no docs", async () => {
      mockGetDocs.mockResolvedValueOnce({ docs: [], empty: true });

      const result = await collaboratorsService.getAll();

      expect(result.data).toHaveLength(0);
      expect(result.hasMore).toBe(false);
      expect(result.lastDoc).toBeNull();
    });

    it("calls getDocs with query using startAfter when pageParam is provided", async () => {
      const pageParam = createMockDoc("last-id", {
        name: "Z",
        email: "z@x.com",
        department: "TI",
        isActive: true,
      }) as unknown as QueryDocumentSnapshot<DocumentData>;
      mockGetDocs.mockResolvedValueOnce({ docs: [], empty: true });

      await collaboratorsService.getAll(pageParam);

      expect(mockGetDocs).toHaveBeenCalledTimes(1);
    });
  });

  describe("getAllManagers", () => {
    it("returns only collaborators with level gestor", async () => {
      const mockDocs = [
        createMockDoc("1", {
          name: "Gestor A",
          email: "gestor@x.com",
          department: "TI",
          isActive: true,
          level: "gestor",
        }),
        createMockDoc("2", {
          name: "Gestor B",
          email: "gestor2@x.com",
          department: "RH",
          isActive: true,
          level: "gestor",
        }),
      ];
      mockGetDocs.mockResolvedValueOnce({ docs: mockDocs, empty: false });

      const result = await collaboratorsService.getAllManagers();

      expect(result).toHaveLength(2);
      expect(result[0]).toMatchObject({
        id: "1",
        name: "Gestor A",
        email: "gestor@x.com",
        level: "gestor",
      });
      expect(result[1]).toMatchObject({
        id: "2",
        name: "Gestor B",
        level: "gestor",
      });
    });

    it("returns empty array when no gestores exist", async () => {
      mockGetDocs.mockResolvedValueOnce({ docs: [], empty: true });

      const result = await collaboratorsService.getAllManagers();

      expect(result).toHaveLength(0);
    });

    it("calls getDocs with query where level equals gestor", async () => {
      mockGetDocs.mockResolvedValueOnce({ docs: [], empty: true });
      const { query } = await import("firebase/firestore");

      await collaboratorsService.getAllManagers();

      expect(query).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({ _where: ["level", "==", "gestor"] }),
      );
    });

    it("returns results sorted by name", async () => {
      const mockDocs = [
        createMockDoc("2", {
          name: "Zelda",
          email: "z@x.com",
          department: "TI",
          isActive: true,
          level: "gestor",
        }),
        createMockDoc("1", {
          name: "Ana",
          email: "a@x.com",
          department: "TI",
          isActive: true,
          level: "gestor",
        }),
      ];
      mockGetDocs.mockResolvedValueOnce({ docs: mockDocs, empty: false });

      const result = await collaboratorsService.getAllManagers();

      expect(result.map((c) => c.name)).toEqual(["Ana", "Zelda"]);
    });
  });

  describe("getById", () => {
    it("returns collaborator when document exists", async () => {
      const mockSnapshot = {
        exists: () => true,
        id: "colab-1",
        data: () => ({
          name: "Maria",
          email: "maria@x.com",
          department: "d1",
          isActive: true,
          occupation: "Dev",
          startDate: "2024-01-01",
          level: "junior",
          managerId: "",
        }),
      };
      mockGetDoc.mockResolvedValueOnce(mockSnapshot);

      const result = await collaboratorsService.getById("colab-1");

      expect(result).toEqual({
        id: "colab-1",
        name: "Maria",
        email: "maria@x.com",
        department: "d1",
        isActive: true,
        occupation: "Dev",
        startDate: "2024-01-01",
        level: "junior",
        managerId: "",
      });
      expect(mockGetDoc).toHaveBeenCalledTimes(1);
    });

    it("returns null when document does not exist", async () => {
      mockGetDoc.mockResolvedValueOnce({ exists: () => false });

      const result = await collaboratorsService.getById("inexistente");

      expect(result).toBeNull();
      expect(mockGetDoc).toHaveBeenCalledTimes(1);
    });

    it("calls getDoc with correct doc ref", async () => {
      mockGetDoc.mockResolvedValueOnce({ exists: () => false });
      const { doc } = await import("firebase/firestore");

      await collaboratorsService.getById("my-id");

      expect(doc).toHaveBeenCalledWith(expect.anything(), "collaborators", "my-id");
    });
  });

  describe("create", () => {
    it("creates collaborator and returns new doc id when email does not exist", async () => {
      mockGetDocs.mockResolvedValueOnce({ docs: [], empty: true });
      mockAddDoc.mockResolvedValueOnce({ id: "new-doc-123" });

      const data: Omit<Collaborator, "id"> = {
        name: "Novo",
        email: "novo@x.com",
        department: "TI",
        isActive: true,
        occupation: "Dev",
        startDate: "2024-01-01",
        level: "junior",
        managerId: "",
      };

      const id = await collaboratorsService.create(data);

      expect(id).toBe("new-doc-123");
      expect(mockGetDocs).toHaveBeenCalledTimes(1);
      expect(mockAddDoc).toHaveBeenCalledTimes(1);
      expect(mockAddDoc).toHaveBeenCalledWith(expect.anything(), data);
    });

    it("converts baseSalary to number when provided", async () => {
      mockGetDocs.mockResolvedValueOnce({ docs: [], empty: true });
      mockAddDoc.mockResolvedValueOnce({ id: "new-id" });

      await collaboratorsService.create({
        name: "Novo",
        email: "novo@x.com",
        department: "TI",
        isActive: true,
        occupation: "Dev",
        startDate: "2024-01-01",
        level: "junior",
        managerId: "",
        baseSalary: 5000,
      });

      expect(mockAddDoc).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({ baseSalary: 5000 }),
      );
    });

    it("throws error when email already exists", async () => {
      const existingDoc = createMockDoc("existing-1", {
        name: "Existente",
        email: "existente@x.com",
        department: "TI",
        isActive: true,
      });
      mockGetDocs.mockResolvedValueOnce({
        docs: [existingDoc],
        empty: false,
      });

      await expect(
        collaboratorsService.create({
          name: "Outro",
          email: "existente@x.com",
          department: "Design",
          isActive: false,
          occupation: "Designer",
          startDate: "2024-01-01",
          level: "pleno",
          managerId: "",
        }),
      ).rejects.toThrow(/já está cadastrado/);

      expect(mockAddDoc).not.toHaveBeenCalled();
    });

    it("thrown error has correct message and email", async () => {
      const existingDoc = createMockDoc("1", {
        name: "A",
        email: "duplicado@x.com",
        department: "TI",
        isActive: true,
      });
      mockGetDocs.mockResolvedValueOnce({
        docs: [existingDoc],
        empty: false,
      });

      try {
        await collaboratorsService.create({
          name: "B",
          email: "duplicado@x.com",
          department: "RH",
          isActive: true,
          occupation: "Analista",
          startDate: "2024-01-01",
          level: "senior",
          managerId: "",
        });
      } catch (e) {
        expect(e).toBeInstanceOf(Error);
        expect((e as Error).name).toBe("EmailAlreadyExistsError");
        expect((e as Error & { email: string }).email).toBe("duplicado@x.com");
        expect((e as Error).message).toMatch(/já está cadastrado/);
      }
    });
  });

  describe("update", () => {
    it("calls updateDoc with correct doc ref and payload", async () => {
      mockGetDocs.mockResolvedValueOnce({ docs: [], empty: true });
      mockUpdateDoc.mockResolvedValueOnce(undefined);

      await collaboratorsService.update("doc-123", {
        name: "Nome Atualizado",
        email: "novo@x.com",
      });

      const { doc } = await import("firebase/firestore");
      expect(doc).toHaveBeenCalledWith(expect.anything(), "collaborators", "doc-123");
      expect(mockUpdateDoc).toHaveBeenCalledTimes(1);
      expect(mockUpdateDoc).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          name: "Nome Atualizado",
          email: "novo@x.com",
        }),
      );
    });

    it("does not call getDocs when data.email is not provided", async () => {
      mockUpdateDoc.mockResolvedValueOnce(undefined);

      await collaboratorsService.update("doc-123", {
        name: "Só nome",
      });

      expect(mockGetDocs).not.toHaveBeenCalled();
      expect(mockUpdateDoc).toHaveBeenCalledTimes(1);
    });

    it("checks email uniqueness when data.email is provided", async () => {
      const otherDoc = createMockDoc("other-id", {
        name: "Outro",
        email: "ocupado@x.com",
        department: "TI",
        isActive: true,
      });
      mockGetDocs.mockResolvedValueOnce({
        docs: [
          { id: "doc-123", data: () => ({ email: "ocupado@x.com" }) },
          otherDoc,
        ],
        empty: false,
      });

      await expect(
        collaboratorsService.update("doc-123", {
          email: "ocupado@x.com",
        }),
      ).rejects.toThrow(/já está cadastrado/);

      expect(mockUpdateDoc).not.toHaveBeenCalled();
    });

    it("does not throw when email belongs to the same document being updated", async () => {
      mockGetDocs.mockResolvedValueOnce({
        docs: [
          {
            id: "doc-123",
            data: () => ({
              name: "João",
              email: "joao@x.com",
              department: "TI",
              isActive: true,
            }),
          },
        ],
        empty: false,
      });
      mockUpdateDoc.mockResolvedValueOnce(undefined);

      await collaboratorsService.update("doc-123", {
        name: "João Silva",
        email: "joao@x.com",
      });

      expect(mockUpdateDoc).toHaveBeenCalledTimes(1);
    });

    it("converts baseSalary to number when provided", async () => {
      mockUpdateDoc.mockResolvedValueOnce(undefined);

      await collaboratorsService.update("doc-123", {
        baseSalary: 7500.5,
      });

      expect(mockUpdateDoc).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({ baseSalary: 7500.5 }),
      );
    });
  });

  describe("delete", () => {
    it("calls deleteDoc with correct doc ref", async () => {
      mockDeleteDoc.mockResolvedValueOnce(undefined);

      await collaboratorsService.delete("doc-to-delete");

      const { doc } = await import("firebase/firestore");
      expect(doc).toHaveBeenCalledWith(
        expect.anything(),
        "collaborators",
        "doc-to-delete",
      );
      expect(mockDeleteDoc).toHaveBeenCalledTimes(1);
    });

    it("resolves when deleteDoc succeeds", async () => {
      mockDeleteDoc.mockResolvedValueOnce(undefined);

      await expect(collaboratorsService.delete("any-id")).resolves.toBeUndefined();
    });
  });

  describe("deleteMany", () => {
    it("does not call writeBatch or commit when ids is empty", async () => {
      const { writeBatch } = await import("firebase/firestore");

      await collaboratorsService.deleteMany([]);

      expect(writeBatch).not.toHaveBeenCalled();
      expect(mockBatchDelete).not.toHaveBeenCalled();
      expect(mockBatchCommit).not.toHaveBeenCalled();
    });

    it("calls batch.delete for each id and batch.commit when ids provided", async () => {
      mockBatchCommit.mockResolvedValueOnce(undefined);
      const { writeBatch, doc } = await import("firebase/firestore");

      await collaboratorsService.deleteMany(["id1", "id2", "id3"]);

      expect(writeBatch).toHaveBeenCalledTimes(1);
      expect(mockBatchDelete).toHaveBeenCalledTimes(3);
      expect(doc).toHaveBeenCalledWith(expect.anything(), "collaborators", "id1");
      expect(doc).toHaveBeenCalledWith(expect.anything(), "collaborators", "id2");
      expect(doc).toHaveBeenCalledWith(expect.anything(), "collaborators", "id3");
      expect(mockBatchCommit).toHaveBeenCalledTimes(1);
    });

    it("resolves when batch.commit succeeds", async () => {
      mockBatchCommit.mockResolvedValueOnce(undefined);

      await expect(
        collaboratorsService.deleteMany(["a", "b"]),
      ).resolves.toBeUndefined();
    });
  });
});
