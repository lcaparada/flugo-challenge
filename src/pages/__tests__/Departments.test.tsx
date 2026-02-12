import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { theme } from "@/theme/muiTheme";
import Departments from "../Departments";
import type { Department } from "@/types/department";
import type { Collaborator } from "@/types/collaborator";

const mockDepartments: Department[] = [
  {
    id: "d1",
    name: "Engenharia",
    collaboratorIds: ["c1"],
    managerId: "c1",
  },
  {
    id: "d2",
    name: "Marketing",
    collaboratorIds: [],
    managerId: "",
  },
];

const mockCollaborators: Collaborator[] = [
  {
    id: "c1",
    name: "Maria Silva",
    email: "maria@example.com",
    department: "d1",
    isActive: true,
    occupation: "Tech Lead",
    startDate: "2024-01-01",
    level: "gestor",
    managerId: "",
  },
];

vi.mock("@/useCases", () => ({
  useGetAllDepartments: () => ({
    departments: mockDepartments,
    isLoading: false,
    isError: false,
    error: null,
  }),
  useGetAllCollaborators: () => ({
    allCollaborators: mockCollaborators,
    isLoading: false,
    isError: false,
    error: null,
    fetchNextPage: vi.fn(),
    hasNextPage: false,
    isFetchingNextPage: false,
  }),
}));

vi.mock("@/components", () => ({
  DepartmentsList: ({
    departments,
    emptyStateAction,
    onEdit,
  }: {
    departments: Department[];
    emptyStateAction?: { label: string; onClick: () => void };
    onEdit: (d: Department) => void;
  }) => (
    <div data-testid="departments-list">
      <span data-testid="departments-count">{departments.length}</span>
      {emptyStateAction && (
        <button
          type="button"
          onClick={emptyStateAction.onClick}
          aria-label={emptyStateAction.label}
        >
          {emptyStateAction.label}
        </button>
      )}
      {departments.map((d) => (
        <button
          key={d.id}
          type="button"
          onClick={() => onEdit(d)}
          data-testid={`edit-${d.id}`}
        >
          Editar {d.name}
        </button>
      ))}
    </div>
  ),
  DepartmentFormModal: ({
    open,
    onClose,
    department,
  }: {
    open: boolean;
    onClose: () => void;
    department: Department | null;
  }) =>
    open ? (
      <div data-testid="department-form-modal">
        <span data-testid="modal-mode">{department ? "edit" : "create"}</span>
        <button type="button" onClick={onClose} aria-label="Fechar modal">
          Fechar
        </button>
      </div>
    ) : null,
  PageHeader: () => <div data-testid="page-header">Page Header</div>,
  Loading: () => <div data-testid="loading">Loading</div>,
  ErrorMessage: ({ message }: { message: string }) => (
    <div data-testid="error-message">{message}</div>
  ),
}));

function renderDepartments() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <Departments />
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>,
  );
}

describe("Departments", () => {
  it("renders the page title", () => {
    renderDepartments();
    expect(
      screen.getByRole("heading", { name: /departamentos/i }),
    ).toBeInTheDocument();
  });

  it("renders the Novo Departamento button", () => {
    renderDepartments();
    const buttons = screen.getAllByRole("button", {
      name: /novo departamento/i,
    });
    expect(buttons.length).toBeGreaterThanOrEqual(1);
  });

  it("renders the PageHeader component", () => {
    renderDepartments();
    expect(screen.getByTestId("page-header")).toBeInTheDocument();
  });

  it("renders the filter input for name", () => {
    renderDepartments();
    const filterInput = screen.getByLabelText(/buscar por nome/i);
    expect(filterInput).toBeInTheDocument();
    expect(filterInput).toHaveAttribute("placeholder", "Nome do departamento");
  });

  it("renders DepartmentsList with all departments when no filter", () => {
    renderDepartments();
    expect(screen.getByTestId("departments-list")).toBeInTheDocument();
    expect(screen.getByTestId("departments-count")).toHaveTextContent("2");
  });

  it("filters departments by name when typing in filter", async () => {
    const user = userEvent.setup();
    renderDepartments();

    const nameInput = screen.getByLabelText(/buscar por nome/i);
    await user.type(nameInput, "Engenharia");

    expect(screen.getByTestId("departments-count")).toHaveTextContent("1");
  });

  it("shows empty filter message when no department matches filter", async () => {
    const user = userEvent.setup();
    renderDepartments();

    const nameInput = screen.getByLabelText(/buscar por nome/i);
    await user.type(nameInput, "Vendas");

    expect(
      screen.getByText(/nenhum departamento encontrado com o filtro aplicado/i),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /limpar filtro/i }),
    ).toBeInTheDocument();
  });

  it("clears filter when clicking Limpar filtro", async () => {
    const user = userEvent.setup();
    renderDepartments();

    const nameInput = screen.getByLabelText(/buscar por nome/i);
    await user.type(nameInput, "Vendas");
    expect(
      screen.getByText(/nenhum departamento encontrado com o filtro aplicado/i),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /limpar filtro/i }));

    expect(nameInput).toHaveValue("");
    expect(screen.getByTestId("departments-count")).toHaveTextContent("2");
  });

  it("opens create modal when clicking Novo Departamento", async () => {
    const user = userEvent.setup();
    renderDepartments();

    expect(
      screen.queryByTestId("department-form-modal"),
    ).not.toBeInTheDocument();

    const novoButtons = screen.getAllByRole("button", {
      name: /novo departamento/i,
    });
    await user.click(novoButtons[0]);

    expect(screen.getByTestId("department-form-modal")).toBeInTheDocument();
    expect(screen.getByTestId("modal-mode")).toHaveTextContent("create");
  });

  it("opens edit modal when clicking edit on a department from list", async () => {
    const user = userEvent.setup();
    renderDepartments();

    expect(
      screen.queryByTestId("department-form-modal"),
    ).not.toBeInTheDocument();

    await user.click(screen.getByTestId("edit-d1"));

    expect(screen.getByTestId("department-form-modal")).toBeInTheDocument();
    expect(screen.getByTestId("modal-mode")).toHaveTextContent("edit");
  });

  it("renders the main content area", () => {
    renderDepartments();
    const main = screen.getByRole("main", {
      name: /conteúdo principal/i,
    });
    expect(main).toBeInTheDocument();
  });
});
