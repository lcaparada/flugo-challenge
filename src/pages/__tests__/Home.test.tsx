import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
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

vi.mock("@/components", () => ({
  CollaboratorsList: ({ collaborators }: { collaborators: unknown[] }) => (
    <div data-testid="collaborators-list">
      Collaborators: {collaborators.length}
    </div>
  ),
  PageHeader: () => <div data-testid="page-header">Page Header</div>,
}));

function renderHome() {
  return render(
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    </ThemeProvider>
  );
}

describe("Home", () => {
  it("renders the page title", () => {
    renderHome();
    expect(screen.getByRole("heading", { name: /colaboradores/i })).toBeInTheDocument();
  });

  it("renders the 'Novo Colaborador' button", () => {
    renderHome();
    expect(screen.getByRole("button", { name: /novo colaborador/i })).toBeInTheDocument();
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

  it("renders the CollaboratorsList component", () => {
    renderHome();
    expect(screen.getByTestId("collaborators-list")).toBeInTheDocument();
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
