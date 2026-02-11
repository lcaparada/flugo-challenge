import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "@/theme/muiTheme";
import Login from "../Login";

const mockNavigate = vi.fn();
const mockLogin = vi.fn();
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

function renderLogin() {
  return render(
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    </ThemeProvider>,
  );
}

describe("Login", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    mockLogin.mockClear();
    mockLogin.mockResolvedValue(undefined);
    mockUseAuth.mockReturnValue({
      user: null,
      isLoading: false,
      login: mockLogin,
      logout: vi.fn(),
      register: vi.fn(),
    });
  });

  it("renders the page title", () => {
    renderLogin();
    expect(screen.getByRole("heading", { name: /entrar/i })).toBeInTheDocument();
  });

  it("renders the logo", () => {
    renderLogin();
    const logo = screen.getByRole("img", { name: /logo/i });
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute("src", "/logo2.png");
  });

  it("renders email and password fields", () => {
    renderLogin();
    expect(screen.getByRole("textbox", { name: /e-mail/i })).toBeInTheDocument();
    expect(screen.getByLabelText("Senha")).toBeInTheDocument();
  });

  it("renders the submit button", () => {
    renderLogin();
    expect(screen.getByRole("button", { name: /entrar/i })).toBeInTheDocument();
  });

  it("renders link to register page", () => {
    renderLogin();
    const link = screen.getByRole("link", { name: /criar conta/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/register");
  });

  it("calls login and navigates to home on valid submit", async () => {
    const user = userEvent.setup();
    renderLogin();

    const emailInput = screen.getByRole("textbox", { name: /e-mail/i });
    const passwordInput = screen.getByLabelText("Senha");
    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "senha123");
    await user.click(screen.getByRole("button", { name: /entrar/i }));

    await vi.waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith("test@example.com", "senha123");
      expect(mockNavigate).toHaveBeenCalledWith("/", { replace: true });
    });
  });

  it("shows Loading when isLoading is true", () => {
    mockUseAuth.mockReturnValue({
      user: null,
      isLoading: true,
      login: mockLogin,
      logout: vi.fn(),
      register: vi.fn(),
    });
    renderLogin();
    expect(screen.getByTestId("loading")).toBeInTheDocument();
  });

  it("does not show login form when user is already logged in", () => {
    mockUseAuth.mockReturnValue({
      user: { uid: "1", email: "a@b.com" } as never,
      isLoading: false,
      login: mockLogin,
      logout: vi.fn(),
      register: vi.fn(),
    });
    renderLogin();
    expect(screen.queryByRole("heading", { name: /entrar/i })).not.toBeInTheDocument();
  });
});
