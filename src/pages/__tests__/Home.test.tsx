import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { theme } from "@/theme/muiTheme";
import Home from "../Home";

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock("@/useCases", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/useCases")>();
  const collaborators = [
    {
      id: "1",
      name: "Test User",
      email: "test@example.com",
      department: "engineering",
      isActive: true,
      occupation: "Dev",
      startDate: "2024-01-01",
      level: "junior",
      managerId: "",
    },
    {
      id: "2",
      name: "Ana Silva",
      email: "ana@example.com",
      department: "marketing",
      isActive: false,
      occupation: "Designer",
      startDate: "2024-02-01",
      level: "pleno",
      managerId: "",
    },
  ];
  return {
    ...actual,
    useGetAllCollaborators: () => ({
      data: {
        pages: [{ data: collaborators, lastDoc: null, hasMore: false }],
      },
      isLoading: false,
      isError: false,
      error: null,
      allCollaborators: collaborators,
      fetchNextPage: vi.fn(),
      hasNextPage: false,
      isFetchingNextPage: false,
    }),
    useGetAllDepartments: () => ({
      departments: [
        { id: "engineering", name: "Engenharia", collaboratorIds: [], managerId: "" },
        { id: "marketing", name: "Marketing", collaboratorIds: [], managerId: "" },
        { id: "design", name: "Design", collaboratorIds: [], managerId: "" },
      ],
      isLoading: false,
      isError: false,
      error: null,
    }),
  };
});

vi.mock("@/components", () => ({
  CollaboratorsList: ({ collaborators }: { collaborators: unknown[] }) => (
    <div data-testid="collaborators-list">
      Collaborators: {collaborators.length}
    </div>
  ),
  PageHeader: () => <div data-testid="page-header">Page Header</div>,
  Loading: () => <div data-testid="loading">Loading</div>,
  ErrorMessage: () => null,
}));

function renderHome() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <Home />
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

describe("Home", () => {
  it("renders the page title", () => {
    renderHome();
    expect(
      screen.getByRole("heading", { name: /colaboradores/i }),
    ).toBeInTheDocument();
  });

  it("renders the 'Novo Colaborador' button", () => {
    renderHome();
    expect(
      screen.getByRole("button", { name: /novo colaborador/i }),
    ).toBeInTheDocument();
  });

  it("navigates to create collaborator page when button is clicked", async () => {
    const user = userEvent.setup();
    renderHome();

    const button = screen.getByRole("button", { name: /novo colaborador/i });
    await user.click(button);

    expect(mockNavigate).toHaveBeenCalledWith("/colaboradores/novo");
  });

  it("renders the PageHeader component", () => {
    renderHome();
    expect(screen.getByTestId("page-header")).toBeInTheDocument();
  });

  it("renders the CollaboratorsList with all collaborators when no filters", () => {
    renderHome();
    expect(screen.getByTestId("collaborators-list")).toBeInTheDocument();
    expect(screen.getByText("Collaborators: 2")).toBeInTheDocument();
  });

  it("renders filter inputs for name, email and department", () => {
    renderHome();
    expect(
      screen.getByRole("textbox", { name: /buscar por nome/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("searchbox", { name: /buscar por e-mail/i }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/departamento/i)).toBeInTheDocument();
  });

  it("department filter has 'Todos' option selected by default", () => {
    renderHome();
    const select = screen.getByLabelText(/departamento/i);
    expect(select).toHaveTextContent("Todos");
  });

  it("filters collaborators by name when typing in name filter", async () => {
    const user = userEvent.setup();
    renderHome();

    const nameInput = screen.getByRole("textbox", { name: /buscar por nome/i });
    await user.type(nameInput, "Ana");

    expect(screen.getByText("Collaborators: 1")).toBeInTheDocument();
  });

  it("shows empty filters message when no collaborator matches filters", async () => {
    const user = userEvent.setup();
    renderHome();

    const nameInput = screen.getByRole("textbox", { name: /buscar por nome/i });
    await user.type(nameInput, "Ninguem");

    expect(
      screen.getByText(/nenhum colaborador encontrado com os filtros/i),
    ).toBeInTheDocument();
    expect(screen.queryByTestId("collaborators-list")).not.toBeInTheDocument();
  });

  it("shows Limpar filtros button when filters are applied and clears filters on click", async () => {
    const user = userEvent.setup();
    renderHome();

    const nameInput = screen.getByRole("textbox", { name: /buscar por nome/i });
    await user.type(nameInput, "Test");

    expect(
      screen.getByRole("button", { name: /limpar filtros/i }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /limpar filtros/i }));

    expect(screen.getByText("Collaborators: 2")).toBeInTheDocument();
    expect(nameInput).toHaveValue("");
  });

  it("renders with MUI Box components", () => {
    const { container } = renderHome();
    const boxes = container.querySelectorAll(".MuiBox-root");
    expect(boxes.length).toBeGreaterThan(0);
  });

  it("renders the button with MUI Button component", () => {
    renderHome();
    const button = screen.getByRole("button", { name: /novo colaborador/i });
    expect(button).toHaveClass("MuiButton-root");
    expect(button).toHaveClass("MuiButton-contained");
  });

  it("renders the main content area", () => {
    renderHome();
    const main = screen.getByRole("main");
    expect(main).toBeInTheDocument();
  });
});
