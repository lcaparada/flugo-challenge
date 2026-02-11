import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "@/theme/muiTheme";
import NotFound from "../NotFound";

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

function renderNotFound() {
  return render(
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <NotFound />
      </BrowserRouter>
    </ThemeProvider>,
  );
}

describe("NotFound", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it("renders 404 heading", () => {
    renderNotFound();
    expect(screen.getByText("404")).toBeInTheDocument();
  });

  it("renders 'Página não encontrada' message", () => {
    renderNotFound();
    expect(
      screen.getByText(/página não encontrada/i),
    ).toBeInTheDocument();
  });

  it("renders button to go home", () => {
    renderNotFound();
    expect(
      screen.getByRole("button", { name: /ir para o início/i }),
    ).toBeInTheDocument();
  });

  it("navigates to home when button is clicked", async () => {
    const user = userEvent.setup();
    renderNotFound();

    await user.click(
      screen.getByRole("button", { name: /ir para o início/i }),
    );

    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  it("renders with MUI components", () => {
    const { container } = renderNotFound();
    expect(container.querySelector(".MuiBox-root")).toBeInTheDocument();
    expect(container.querySelector(".MuiButton-root")).toBeInTheDocument();
    expect(container.querySelector(".MuiTypography-root")).toBeInTheDocument();
  });
});
