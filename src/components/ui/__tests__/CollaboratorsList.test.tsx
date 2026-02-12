import type { ReactElement } from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CollaboratorsList } from "../CollaboratorsList";
import type { Collaborator } from "@/types/collaborator";

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
    id: "1",
    name: "Ana Silva",
    email: "ana@example.com",
    department: "engineering",
    isActive: true,
    occupation: "Dev",
    startDate: "2024-01-01",
    level: "junior",
    managerId: "",
  },
  {
    id: "2",
    name: "Carlos Santos",
    email: "carlos@example.com",
    department: "marketing",
    isActive: false,
    occupation: "Designer",
    startDate: "2024-02-01",
    level: "pleno",
    managerId: "",
  },
  {
    id: "3",
    name: "Beatriz Lima",
    email: "beatriz@example.com",
    department: "design",
    isActive: true,
    occupation: "Manager",
    startDate: "2024-03-01",
    level: "senior",
    managerId: "",
  },
];

describe("CollaboratorsList", () => {
  it("renders the table with headers", () => {
    renderWithProviders(
      <CollaboratorsList collaborators={mockCollaborators} />,
    );

    expect(screen.getByText("Nome")).toBeInTheDocument();
    expect(screen.getByText("Email")).toBeInTheDocument();
    expect(screen.getByText("Departamento")).toBeInTheDocument();
    expect(screen.getByText("Status")).toBeInTheDocument();
  });

  it("renders all collaborators data", () => {
    renderWithProviders(
      <CollaboratorsList collaborators={mockCollaborators} />,
    );

    expect(screen.getByText("Ana Silva")).toBeInTheDocument();
    expect(screen.getByText("ana@example.com")).toBeInTheDocument();
    expect(screen.getByText("Engenharia")).toBeInTheDocument();

    expect(screen.getByText("Carlos Santos")).toBeInTheDocument();
    expect(screen.getByText("carlos@example.com")).toBeInTheDocument();
    expect(screen.getByText("Marketing")).toBeInTheDocument();

    expect(screen.getByText("Beatriz Lima")).toBeInTheDocument();
    expect(screen.getByText("beatriz@example.com")).toBeInTheDocument();
    expect(screen.getByText("Design")).toBeInTheDocument();
  });

  it("displays active and inactive status correctly", () => {
    renderWithProviders(
      <CollaboratorsList collaborators={mockCollaborators} />,
    );

    const activeChips = screen.getAllByText("Ativo");
    const inactiveChips = screen.getAllByText("Inativo");

    expect(activeChips).toHaveLength(2);
    expect(inactiveChips).toHaveLength(1);
  });

  it("renders empty state when no collaborators", () => {
    renderWithProviders(<CollaboratorsList collaborators={[]} />);

    expect(
      screen.getByRole("status", { name: /nenhum colaborador cadastrado/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/adicione o primeiro colaborador para começar/i),
    ).toBeInTheDocument();
    expect(screen.queryByText("Nome")).not.toBeInTheDocument();
  });

  it("renders empty state with action button when emptyStateAction is provided", async () => {
    const onAction = vi.fn();
    renderWithProviders(
      <CollaboratorsList
        collaborators={[]}
        emptyStateAction={{ label: "Novo Colaborador", onClick: onAction }}
      />,
    );

    const button = screen.getByRole("button", { name: /novo colaborador/i });
    expect(button).toBeInTheDocument();
    await userEvent.setup().click(button);
    expect(onAction).toHaveBeenCalledTimes(1);
  });

  it("sorts by name when clicking name header", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <CollaboratorsList collaborators={mockCollaborators} />,
    );

    let rows = screen.getAllByRole("row");
    let firstDataRow = rows[1];
    let firstRowCells = within(firstDataRow).getAllByRole("cell");
    // Col 0 = checkbox, col 1 = name
    expect(firstRowCells[1]).toHaveTextContent("Ana Silva");

    const nameHeader = screen.getByText("Nome");
    await user.click(nameHeader);

    rows = screen.getAllByRole("row");
    firstDataRow = rows[1];
    firstRowCells = within(firstDataRow).getAllByRole("cell");
    expect(firstRowCells[1]).toHaveTextContent("Carlos Santos");
  });

  it("toggles sort direction when clicking same header twice", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <CollaboratorsList collaborators={mockCollaborators} />,
    );

    const nameHeader = screen.getByText("Nome");

    let rows = screen.getAllByRole("row");
    let firstDataRow = rows[1];
    let firstRowCells = within(firstDataRow).getAllByRole("cell");
    expect(firstRowCells[1]).toHaveTextContent("Ana Silva");

    await user.click(nameHeader);
    rows = screen.getAllByRole("row");
    firstDataRow = rows[1];
    firstRowCells = within(firstDataRow).getAllByRole("cell");
    expect(firstRowCells[1]).toHaveTextContent("Carlos Santos");

    await user.click(nameHeader);
    rows = screen.getAllByRole("row");
    firstDataRow = rows[1];
    firstRowCells = within(firstDataRow).getAllByRole("cell");
    expect(firstRowCells[1]).toHaveTextContent("Ana Silva");
  });

  it("sorts by email when clicking email header", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <CollaboratorsList collaborators={mockCollaborators} />,
    );

    const emailHeader = screen.getByText("Email");
    await user.click(emailHeader);

    const rows = screen.getAllByRole("row");
    const firstDataRow = rows[1];
    const firstRowCells = within(firstDataRow).getAllByRole("cell");
    expect(firstRowCells[2]).toHaveTextContent("ana@example.com");
  });

  it("sorts by department when clicking department header", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <CollaboratorsList collaborators={mockCollaborators} />,
    );

    const departmentHeader = screen.getByText("Departamento");
    await user.click(departmentHeader);

    const rows = screen.getAllByRole("row");
    const firstDataRow = rows[1];
    const firstRowCells = within(firstDataRow).getAllByRole("cell");
    expect(firstRowCells[3]).toHaveTextContent("Design");
  });

  it("sorts by status when clicking status header", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <CollaboratorsList collaborators={mockCollaborators} />,
    );

    const statusHeader = screen.getByText("Status");
    await user.click(statusHeader);

    const rows = screen.getAllByRole("row");
    const firstDataRow = rows[1];
    const cells = within(firstDataRow).getAllByRole("cell");
    const statusCell = cells[9];
    expect(statusCell).toHaveTextContent("Inativo");
  });

  it("has sort icons on all headers", () => {
    renderWithProviders(
      <CollaboratorsList collaborators={mockCollaborators} />,
    );

    const sortButtons = screen.getAllByRole("button");
    expect(sortButtons.length).toBeGreaterThanOrEqual(4);
  });

  it("applies correct styling to table container", () => {
    const { container } = renderWithProviders(
      <CollaboratorsList collaborators={mockCollaborators} />,
    );

    const tableContainer = container.querySelector(".MuiTableContainer-root");
    expect(tableContainer).toBeInTheDocument();

    expect(container.querySelector("table")).toBeInTheDocument();
  });
});
