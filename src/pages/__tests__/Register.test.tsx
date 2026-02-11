import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "@/theme/muiTheme";
import Register from "../Register";

const mockNavigate = vi.fn();
const mockRegister = vi.fn();
const mockUseAuth = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock("@/hooks", () => ({
  useAuth: () => mockUseAuth(),
}));

vi.mock("@/components", async () => {
  const actual = await vi.importActual<typeof import("@/components")>("@/components");
  return {
    ...actual,
    Loading: () => <div data-testid="loading">Loading</div>,
  };
});

function renderRegister() {
  return render(
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    </ThemeProvider>,
  );
}

describe("Register", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    mockRegister.mockClear();
    mockRegister.mockResolvedValue(undefined);
    mockUseAuth.mockReturnValue({
      user: null,
      isLoading: false,
      login: vi.fn(),
      logout: vi.fn(),
      register: mockRegister,
    });
  });

  it("renders the page title", () => {
    renderRegister();
    expect(
      screen.getByRole("heading", { name: /criar conta/i }),
    ).toBeInTheDocument();
  });

  it("renders the logo", () => {
    renderRegister();
    const logo = screen.getByRole("img", { name: /logo/i });
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute("src", "/logo2.png");
  });

  it("renders email, password and confirm password fields", () => {
    renderRegister();
    expect(screen.getByLabelText(/e-mail/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^senha$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirmar senha/i)).toBeInTheDocument();
  });

  it("renders the submit button", () => {
    renderRegister();
    expect(
      screen.getByRole("button", { name: /criar conta/i }),
    ).toBeInTheDocument();
  });

  it("renders link to login page", () => {
    renderRegister();
    const link = screen.getByRole("link", { name: /entrar/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/login");
  });

  it("calls register and navigates to home on valid submit", async () => {
    const user = userEvent.setup();
    renderRegister();

    const emailInput = screen.getByRole("textbox", { name: /e-mail/i });
    const passwordInput = screen.getByLabelText(/^senha$/i);
    const confirmInput = screen.getByLabelText(/confirmar senha/i);
    await user.type(emailInput, "new@example.com");
    await user.type(passwordInput, "senha123");
    await user.type(confirmInput, "senha123");
    await user.click(screen.getByRole("button", { name: /criar conta/i }));

    await vi.waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith("new@example.com", "senha123");
      expect(mockNavigate).toHaveBeenCalledWith("/", { replace: true });
    });
  });

  it("shows Loading when isLoading is true", () => {
    mockUseAuth.mockReturnValue({
      user: null,
      isLoading: true,
      login: vi.fn(),
      logout: vi.fn(),
      register: mockRegister,
    });
    renderRegister();
    expect(screen.getByTestId("loading")).toBeInTheDocument();
  });

  it("does not show register form when user is already logged in", () => {
    mockUseAuth.mockReturnValue({
      user: { uid: "1", email: "a@b.com" } as never,
      isLoading: false,
      login: vi.fn(),
      logout: vi.fn(),
      register: mockRegister,
    });
    renderRegister();
    expect(
      screen.queryByRole("heading", { name: /criar conta/i }),
    ).not.toBeInTheDocument();
  });
});
