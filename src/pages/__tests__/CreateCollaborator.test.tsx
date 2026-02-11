import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { theme } from "@/theme/muiTheme";
import CreateCollaborator from "../CreateCollaborator";

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock("@/components", async () => {
  const actual = await vi.importActual("@/components");
  return {
    ...actual,
    PageHeader: () => <div data-testid="page-header">Page Header</div>,
  };
});

function renderCreateCollaborator() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <CreateCollaborator />
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>,
  );
}

describe("CreateCollaborator", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it("renders the breadcrumb navigation", () => {
    renderCreateCollaborator();
    expect(screen.getByText("Colaboradores")).toBeInTheDocument();
    expect(screen.getByText("Cadastrar Colaborador")).toBeInTheDocument();
  });

  it("renders the stepper with two steps", () => {
    renderCreateCollaborator();
    const basicInfoTexts = screen.getAllByText("Informações Básicas");
    const professionalInfoTexts = screen.getAllByText("Infos Profissionais");
    expect(basicInfoTexts.length).toBeGreaterThan(0);
    expect(professionalInfoTexts.length).toBeGreaterThan(0);
  });

  it("renders the first step as active by default", () => {
    renderCreateCollaborator();
    const heading = screen.getByRole("heading", {
      name: /informações básicas/i,
    });
    expect(heading).toBeInTheDocument();
  });

  it("renders basic info form fields in step 1", () => {
    renderCreateCollaborator();
    expect(screen.getByLabelText(/título/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/e-mail/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/ativar ao criar/i)).toBeInTheDocument();
  });

  it("renders the progress bar with correct initial value", () => {
    renderCreateCollaborator();
    expect(screen.getByText("50%")).toBeInTheDocument();
  });

  it("renders navigation buttons", () => {
    renderCreateCollaborator();
    expect(screen.getByRole("button", { name: /voltar/i })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /próximo/i }),
    ).toBeInTheDocument();
  });

  it("navigates to home when clicking 'Voltar' on first step", async () => {
    const user = userEvent.setup();
    renderCreateCollaborator();

    const backButton = screen.getByRole("button", { name: /voltar/i });
    await user.click(backButton);

    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  it("advances to step 2 when clicking 'Próximo' with valid data", async () => {
    const user = userEvent.setup();
    renderCreateCollaborator();

    const nameInput = screen.getByLabelText(/título/i);
    const emailInput = screen.getByLabelText(/e-mail/i);

    await user.type(nameInput, "João da Silva");
    await user.type(emailInput, "joao@example.com");

    const nextButton = screen.getByRole("button", { name: /próximo/i });
    await user.click(nextButton);

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: /infos profissionais/i }),
      ).toBeInTheDocument();
    });
  });

  it("renders department field in step 2", async () => {
    const user = userEvent.setup();
    renderCreateCollaborator();

    await user.type(screen.getByLabelText(/título/i), "João da Silva");
    await user.type(screen.getByLabelText(/e-mail/i), "joao@example.com");
    await user.click(screen.getByRole("button", { name: /próximo/i }));

    await waitFor(() => {
      expect(screen.getByLabelText(/departamento/i)).toBeInTheDocument();
    });
  });

  it("shows 'Finalizar' button on last step", async () => {
    const user = userEvent.setup();
    renderCreateCollaborator();

    await user.type(screen.getByLabelText(/título/i), "João da Silva");
    await user.type(screen.getByLabelText(/e-mail/i), "joao@example.com");
    await user.click(screen.getByRole("button", { name: /próximo/i }));

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /finalizar/i }),
      ).toBeInTheDocument();
    });
  });

  it("goes back to step 1 when clicking 'Voltar' on step 2", async () => {
    const user = userEvent.setup();
    renderCreateCollaborator();

    await user.type(screen.getByLabelText(/título/i), "João da Silva");
    await user.type(screen.getByLabelText(/e-mail/i), "joao@example.com");
    await user.click(screen.getByRole("button", { name: /próximo/i }));

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: /infos profissionais/i }),
      ).toBeInTheDocument();
    });

    const backButton = screen.getByRole("button", { name: /voltar/i });
    await user.click(backButton);

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: /informações básicas/i }),
      ).toBeInTheDocument();
    });
  });

  it("updates progress bar when advancing to step 2", async () => {
    const user = userEvent.setup();
    renderCreateCollaborator();

    expect(screen.getByText("50%")).toBeInTheDocument();

    await user.type(screen.getByLabelText(/título/i), "João da Silva");
    await user.type(screen.getByLabelText(/e-mail/i), "joao@example.com");
    await user.click(screen.getByRole("button", { name: /próximo/i }));

    await waitFor(() => {
      expect(screen.getByText("100%")).toBeInTheDocument();
    });
  });

  it("renders the PageHeader component", () => {
    renderCreateCollaborator();
    expect(screen.getByTestId("page-header")).toBeInTheDocument();
  });

  it("renders with MUI components", () => {
    const { container } = renderCreateCollaborator();
    expect(container.querySelector(".MuiBox-root")).toBeInTheDocument();
    expect(container.querySelector(".MuiButton-root")).toBeInTheDocument();
    expect(
      container.querySelector(".MuiLinearProgress-root"),
    ).toBeInTheDocument();
    expect(container.querySelector(".MuiStepper-root")).toBeInTheDocument();
  });

  it("breadcrumb link navigates to home", async () => {
    const user = userEvent.setup();
    renderCreateCollaborator();

    const breadcrumbLink = screen.getByText("Colaboradores");
    await user.click(breadcrumbLink);

    expect(mockNavigate).toHaveBeenCalledWith("/");
  });
});
