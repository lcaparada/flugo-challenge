import { describe, it, expect, vi, beforeEach } from "vitest";
import type { QueryDocumentSnapshot, DocumentData } from "firebase/firestore";
import { collaboratorsService } from "../collaborators.service";
import type { Collaborator } from "@/types/collaborator";

const mockGetDocs = vi.fn();
const mockAddDoc = vi.fn();

vi.mock("@/lib/firebase", () => ({
  db: {},
}));

vi.mock("firebase/firestore", () => ({
  collection: vi.fn((_db: unknown, name: string) => ({ _collection: name })),
  query: vi.fn((...args: unknown[]) => ({ _query: args })),
  orderBy: vi.fn((field: string) => ({ _orderBy: field })),
  limit: vi.fn((n: number) => ({ _limit: n })),
  startAfter: vi.fn((doc: unknown) => ({ _startAfter: doc })),
  where: vi.fn((field: string, op: string, value: unknown) => ({
    _where: [field, op, value],
  })),
  getDocs: (...args: unknown[]) => mockGetDocs(...args),
  addDoc: (...args: unknown[]) => mockAddDoc(...args),
}));

function createMockDoc(
  id: string,
  data: Omit<Collaborator, "id">,
): { id: string; data: () => Omit<Collaborator, "id"> } {
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

  describe("create", () => {
    it("creates collaborator and returns new doc id when email does not exist", async () => {
      mockGetDocs.mockResolvedValueOnce({ docs: [], empty: true });
      mockAddDoc.mockResolvedValueOnce({ id: "new-doc-123" });

      const data: Omit<Collaborator, "id"> = {
        name: "Novo",
        email: "novo@x.com",
        department: "TI",
        isActive: true,
      };

      const id = await collaboratorsService.create(data);

      expect(id).toBe("new-doc-123");
      expect(mockGetDocs).toHaveBeenCalledTimes(1);
      expect(mockAddDoc).toHaveBeenCalledTimes(1);
      expect(mockAddDoc).toHaveBeenCalledWith(
        expect.anything(),
        data,
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
        });
      } catch (e) {
        expect(e).toBeInstanceOf(Error);
        expect((e as Error).name).toBe("EmailAlreadyExistsError");
        expect((e as Error & { email: string }).email).toBe("duplicado@x.com");
        expect((e as Error).message).toMatch(/já está cadastrado/);
      }
    });
  });
});
