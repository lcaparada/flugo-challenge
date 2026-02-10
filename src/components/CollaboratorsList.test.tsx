import { describe, it, expect } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CollaboratorsList } from "./CollaboratorsList";
import type { Collaborator } from "@/types/collaborator";

const mockCollaborators: Collaborator[] = [
  {
    id: "1",
    name: "Ana Silva",
    email: "ana@example.com",
    department: "TI",
    isActive: true,
  },
  {
    id: "2",
    name: "Carlos Santos",
    email: "carlos@example.com",
    department: "Marketing",
    isActive: false,
  },
  {
    id: "3",
    name: "Beatriz Lima",
    email: "beatriz@example.com",
    department: "Design",
    isActive: true,
  },
];

describe("CollaboratorsList", () => {
  it("renders the table with headers", () => {
    render(<CollaboratorsList collaborators={mockCollaborators} />);

    expect(screen.getByText("Nome")).toBeInTheDocument();
    expect(screen.getByText("Email")).toBeInTheDocument();
    expect(screen.getByText("Departamento")).toBeInTheDocument();
    expect(screen.getByText("Status")).toBeInTheDocument();
  });

  it("renders all collaborators data", () => {
    render(<CollaboratorsList collaborators={mockCollaborators} />);

    expect(screen.getByText("Ana Silva")).toBeInTheDocument();
    expect(screen.getByText("ana@example.com")).toBeInTheDocument();
    expect(screen.getByText("TI")).toBeInTheDocument();

    expect(screen.getByText("Carlos Santos")).toBeInTheDocument();
    expect(screen.getByText("carlos@example.com")).toBeInTheDocument();
    expect(screen.getByText("Marketing")).toBeInTheDocument();

    expect(screen.getByText("Beatriz Lima")).toBeInTheDocument();
    expect(screen.getByText("beatriz@example.com")).toBeInTheDocument();
    expect(screen.getByText("Design")).toBeInTheDocument();
  });

  it("displays active and inactive status correctly", () => {
    render(<CollaboratorsList collaborators={mockCollaborators} />);

    const activeChips = screen.getAllByText("Ativo");
    const inactiveChips = screen.getAllByText("Inativo");

    expect(activeChips).toHaveLength(2);
    expect(inactiveChips).toHaveLength(1);
  });

  it("renders empty table when no collaborators", () => {
    render(<CollaboratorsList collaborators={[]} />);

    expect(screen.getByText("Nome")).toBeInTheDocument();
    expect(screen.queryByText("Ana Silva")).not.toBeInTheDocument();
  });

  it("sorts by name when clicking name header", async () => {
    const user = userEvent.setup();
    render(<CollaboratorsList collaborators={mockCollaborators} />);

    let rows = screen.getAllByRole("row");
    let firstDataRow = rows[1];
    let firstRowCells = within(firstDataRow).getAllByRole("cell");
    expect(firstRowCells[0]).toHaveTextContent("Ana Silva");

    const nameHeader = screen.getByText("Nome");
    await user.click(nameHeader);

    rows = screen.getAllByRole("row");
    firstDataRow = rows[1];
    firstRowCells = within(firstDataRow).getAllByRole("cell");
    expect(firstRowCells[0]).toHaveTextContent("Carlos Santos");
  });

  it("toggles sort direction when clicking same header twice", async () => {
    const user = userEvent.setup();
    render(<CollaboratorsList collaborators={mockCollaborators} />);

    const nameHeader = screen.getByText("Nome");

    let rows = screen.getAllByRole("row");
    let firstDataRow = rows[1];
    let firstRowCells = within(firstDataRow).getAllByRole("cell");
    expect(firstRowCells[0]).toHaveTextContent("Ana Silva");

    await user.click(nameHeader);
    rows = screen.getAllByRole("row");
    firstDataRow = rows[1];
    firstRowCells = within(firstDataRow).getAllByRole("cell");
    expect(firstRowCells[0]).toHaveTextContent("Carlos Santos");

    await user.click(nameHeader);
    rows = screen.getAllByRole("row");
    firstDataRow = rows[1];
    firstRowCells = within(firstDataRow).getAllByRole("cell");
    expect(firstRowCells[0]).toHaveTextContent("Ana Silva");
  });

  it("sorts by email when clicking email header", async () => {
    const user = userEvent.setup();
    render(<CollaboratorsList collaborators={mockCollaborators} />);

    const emailHeader = screen.getByText("Email");
    await user.click(emailHeader);

    const rows = screen.getAllByRole("row");
    const firstDataRow = rows[1];
    const firstRowCells = within(firstDataRow).getAllByRole("cell");

    expect(firstRowCells[1]).toHaveTextContent("ana@example.com");
  });

  it("sorts by department when clicking department header", async () => {
    const user = userEvent.setup();
    render(<CollaboratorsList collaborators={mockCollaborators} />);

    const departmentHeader = screen.getByText("Departamento");
    await user.click(departmentHeader);

    const rows = screen.getAllByRole("row");
    const firstDataRow = rows[1];
    const firstRowCells = within(firstDataRow).getAllByRole("cell");

    expect(firstRowCells[2]).toHaveTextContent("Design");
  });

  it("sorts by status when clicking status header", async () => {
    const user = userEvent.setup();
    render(<CollaboratorsList collaborators={mockCollaborators} />);

    const statusHeader = screen.getByText("Status");
    await user.click(statusHeader);

    const rows = screen.getAllByRole("row");
    const firstDataRow = rows[1];
    const cells = within(firstDataRow).getAllByRole("cell");
    const statusCell = cells[3];

    expect(statusCell).toHaveTextContent("Inativo");
  });

  it("has sort icons on all headers", () => {
    render(<CollaboratorsList collaborators={mockCollaborators} />);

    const sortButtons = screen.getAllByRole("button");
    expect(sortButtons.length).toBeGreaterThanOrEqual(4);
  });

  it("applies correct styling to table container", () => {
    const { container } = render(
      <CollaboratorsList collaborators={mockCollaborators} />,
    );

    const paper = container.querySelector(".MuiPaper-root");
    expect(paper).toBeInTheDocument();
  });
});
