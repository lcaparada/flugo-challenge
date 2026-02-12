import type { ReactElement } from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { DepartmentsList } from "../DepartmentsList";
import type { Department } from "@/types/department";
import type { Collaborator } from "@/types/collaborator";

const mockDeleteMutate = vi.fn();

vi.mock("@/useCases", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/useCases")>();
  return {
    ...actual,
    useDeleteDepartments: () => ({
      mutateAsync: mockDeleteMutate,
      isPending: false,
    }),
  };
});

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
});

function renderWithProviders(ui: ReactElement) {
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>,
  );
}

const mockCollaborators: Collaborator[] = [
  {
    id: "c1",
    name: "Maria Gestora",
    email: "maria@example.com",
    department: "d1",
    isActive: true,
    occupation: "Tech Lead",
    startDate: "2024-01-01",
    level: "gestor",
    managerId: "",
  },
  {
    id: "c2",
    name: "João Dev",
    email: "joao@example.com",
    department: "d1",
    isActive: true,
    occupation: "Dev",
    startDate: "2024-02-01",
    level: "junior",
    managerId: "c1",
  },
];

const mockDepartments: Department[] = [
  {
    id: "d1",
    name: "Engenharia",
    collaboratorIds: ["c1", "c2"],
    managerId: "c1",
  },
  {
    id: "d2",
    name: "Marketing",
    collaboratorIds: [],
    managerId: "",
  },
];

describe("DepartmentsList", () => {
  beforeEach(() => {
    mockDeleteMutate.mockClear();
  });

  it("renders empty state when no departments", () => {
    renderWithProviders(
      <DepartmentsList departments={[]} collaborators={[]} onEdit={vi.fn()} />,
    );

    expect(
      screen.getByText(/nenhum departamento cadastrado/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/adicione o primeiro departamento para começar/i),
    ).toBeInTheDocument();
    expect(screen.queryByText("Nome")).not.toBeInTheDocument();
  });

  it("renders empty state with action when emptyStateAction is provided", async () => {
    const onAction = vi.fn();
    renderWithProviders(
      <DepartmentsList
        departments={[]}
        collaborators={[]}
        onEdit={vi.fn()}
        emptyStateAction={{ label: "Novo Departamento", onClick: onAction }}
      />,
    );

    const button = screen.getByRole("button", { name: /novo departamento/i });
    expect(button).toBeInTheDocument();
    await userEvent.setup().click(button);
    expect(onAction).toHaveBeenCalledTimes(1);
  });

  it("renders table with headers", () => {
    renderWithProviders(
      <DepartmentsList
        departments={mockDepartments}
        collaborators={mockCollaborators}
        onEdit={vi.fn()}
      />,
    );

    expect(screen.getByText("Nome")).toBeInTheDocument();
    expect(screen.getByText("Gestor")).toBeInTheDocument();
    expect(screen.getByText("Colaboradores")).toBeInTheDocument();
    expect(screen.getByText("Ações")).toBeInTheDocument();
  });

  it("renders department rows with name, manager and collaborator count", () => {
    renderWithProviders(
      <DepartmentsList
        departments={mockDepartments}
        collaborators={mockCollaborators}
        onEdit={vi.fn()}
      />,
    );

    expect(screen.getByText("Engenharia")).toBeInTheDocument();
    expect(screen.getByText("Maria Gestora")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();

    expect(screen.getByText("Marketing")).toBeInTheDocument();
    expect(screen.getByText("—")).toBeInTheDocument();
    expect(screen.getByText("0")).toBeInTheDocument();
  });

  it("calls onEdit when Edit button is clicked", async () => {
    const onEdit = vi.fn();
    const user = userEvent.setup();
    renderWithProviders(
      <DepartmentsList
        departments={mockDepartments}
        collaborators={mockCollaborators}
        onEdit={onEdit}
      />,
    );

    const editButton = screen.getByRole("button", {
      name: /editar engenharia/i,
    });
    await user.click(editButton);
    expect(onEdit).toHaveBeenCalledTimes(1);
    expect(onEdit).toHaveBeenCalledWith(mockDepartments[0]);
  });

  it("opens delete confirmation dialog when Delete is clicked", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <DepartmentsList
        departments={mockDepartments}
        collaborators={mockCollaborators}
        onEdit={vi.fn()}
      />,
    );

    const deleteButton = screen.getByRole("button", {
      name: /excluir engenharia/i,
    });
    await user.click(deleteButton);

    expect(
      screen.getByRole("dialog", { name: /excluir departamento\?/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/tem certeza que deseja excluir "engenharia"\?/i),
    ).toBeInTheDocument();
  });

  it("has Cancelar and Excluir in delete dialog", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <DepartmentsList
        departments={mockDepartments}
        collaborators={mockCollaborators}
        onEdit={vi.fn()}
      />,
    );

    await user.click(
      screen.getByRole("button", { name: /excluir engenharia/i }),
    );

    expect(
      screen.getByRole("button", { name: /cancelar/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /^excluir$/i }),
    ).toBeInTheDocument();
  });

  it("shows selection bar when at least one row is selected", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <DepartmentsList
        departments={mockDepartments}
        collaborators={mockCollaborators}
        onEdit={vi.fn()}
      />,
    );

    expect(screen.queryByText(/selecionado\(s\)/i)).not.toBeInTheDocument();

    const checkboxes = screen.getAllByRole("checkbox");
    await user.click(checkboxes[1]);

    expect(screen.getByText(/1 selecionado\(s\)/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /excluir selecionados/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /desmarcar todos/i }),
    ).toBeInTheDocument();
  });

  it("sorts by name when clicking Nome header", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <DepartmentsList
        departments={mockDepartments}
        collaborators={mockCollaborators}
        onEdit={vi.fn()}
      />,
    );

    const rows = screen.getAllByRole("row");
    const firstDataRow = rows[1];
    const cells = within(firstDataRow).getAllByRole("cell");
    expect(cells[1]).toHaveTextContent("Engenharia");

    const nameHeader = screen.getByRole("button", {
      name: /ordenar por nome/i,
    });
    await user.click(nameHeader);

    const rowsAfter = screen.getAllByRole("row");
    const firstDataRowAfter = rowsAfter[1];
    const cellsAfter = within(firstDataRowAfter).getAllByRole("cell");
    expect(cellsAfter[1]).toHaveTextContent("Marketing");
  });

  it("sorts by Colaboradores when clicking Colaboradores header", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <DepartmentsList
        departments={mockDepartments}
        collaborators={mockCollaborators}
        onEdit={vi.fn()}
      />,
    );

    const collaboratorHeader = screen.getByRole("button", {
      name: /ordenar por colaboradores/i,
    });
    await user.click(collaboratorHeader);

    const rows = screen.getAllByRole("row");
    const firstDataRow = rows[1];
    const cells = within(firstDataRow).getAllByRole("cell");
    expect(cells[3]).toHaveTextContent("0");
  });

  it("select all checkbox selects all rows", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <DepartmentsList
        departments={mockDepartments}
        collaborators={mockCollaborators}
        onEdit={vi.fn()}
      />,
    );

    const checkboxes = screen.getAllByRole("checkbox");
    await user.click(checkboxes[0]);

    expect(screen.getByText(/2 selecionado\(s\)/i)).toBeInTheDocument();
  });

  it("calls deleteDepartments when confirming delete", async () => {
    mockDeleteMutate.mockResolvedValue(undefined);
    const user = userEvent.setup();
    renderWithProviders(
      <DepartmentsList
        departments={mockDepartments}
        collaborators={mockCollaborators}
        onEdit={vi.fn()}
      />,
    );

    await user.click(
      screen.getByRole("button", { name: /excluir engenharia/i }),
    );
    const confirmButton = screen.getByRole("button", { name: /^excluir$/i });
    await user.click(confirmButton);

    expect(mockDeleteMutate).toHaveBeenCalledWith(["d1"]);
  });
});
