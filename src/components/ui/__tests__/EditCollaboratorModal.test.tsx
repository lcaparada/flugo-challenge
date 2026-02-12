import "dayjs/locale/pt-br";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { EditCollaboratorModal } from "../EditCollaboratorModal";
import type { Collaborator } from "@/types/collaborator";

const mockOnClose = vi.fn();
const mockMutateAsync = vi.fn();

const defaultUpdateReturn = {
  mutateAsync: mockMutateAsync,
  isPending: false,
  isError: false,
  error: null as Error | null,
};

vi.mock("@/useCases", () => ({
  useUpdateCollaborator: () => ({ ...defaultUpdateReturn }),
  useGetAllManagers: () => ({
    managers: [
      { id: "m1", name: "Gestor Um", level: "gestor" },
      { id: "m2", name: "Gestor Dois", level: "gestor" },
    ] as Collaborator[],
  }),
}));

const defaultCollaborator: Collaborator = {
  id: "c1",
  name: "João Silva",
  email: "joao@example.com",
  department: "engineering",
  isActive: true,
  occupation: "Desenvolvedor",
  startDate: "2024-01-15",
  level: "junior",
  managerId: "m1",
  baseSalary: 5000,
};

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
});

function renderModal(props: {
  open?: boolean;
  onClose?: () => void;
  collaborator: Collaborator | null;
}) {
  return render(
    <QueryClientProvider client={queryClient}>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
        <EditCollaboratorModal
          open={props.open ?? true}
          onClose={props.onClose ?? mockOnClose}
          collaborator={props.collaborator}
        />
      </LocalizationProvider>
    </QueryClientProvider>,
  );
}

describe("EditCollaboratorModal", () => {
  beforeEach(() => {
    mockOnClose.mockClear();
    mockMutateAsync.mockClear();
    defaultUpdateReturn.isPending = false;
    defaultUpdateReturn.isError = false;
    defaultUpdateReturn.error = null;
  });

  it("returns null when collaborator is null", () => {
    const { container } = renderModal({ collaborator: null });
    expect(container.firstChild).toBeNull();
  });

  it("renders dialog with title when open and collaborator provided", () => {
    renderModal({ collaborator: defaultCollaborator });
    expect(
      screen.getByRole("dialog", { name: /editar colaborador/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /editar colaborador/i }),
    ).toBeInTheDocument();
  });

  it("pre-fills form with collaborator data", () => {
    renderModal({ collaborator: defaultCollaborator });
    const nameInput = screen.getByLabelText(/nome/i) as HTMLInputElement;
    const emailInput = screen.getByLabelText(/e-mail/i) as HTMLInputElement;
    expect(nameInput.value).toBe("João Silva");
    expect(emailInput.value).toBe("joao@example.com");
  });

  it("calls onClose when Cancel button is clicked", async () => {
    const user = userEvent.setup();
    renderModal({ collaborator: defaultCollaborator });
    const cancelButton = screen.getByRole("button", { name: /cancelar/i });
    await user.click(cancelButton);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("renders all main form fields", () => {
    renderModal({ collaborator: defaultCollaborator });
    expect(screen.getByLabelText(/nome/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/e-mail/i)).toBeInTheDocument();
    expect(screen.getByText(/ativo/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/departamento/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/cargo/i)).toBeInTheDocument();
    expect(
      screen.getByRole("group", { name: /data de admissão/i }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/nível hierárquico/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/gestor responsável/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/salário base/i)).toBeInTheDocument();
  });

  it("does not render Gestor responsável when level is gestor", () => {
    const gestorCollaborator: Collaborator = {
      ...defaultCollaborator,
      level: "gestor",
      managerId: "",
    };
    renderModal({ collaborator: gestorCollaborator });
    expect(
      screen.queryByLabelText(/gestor responsável/i),
    ).not.toBeInTheDocument();
  });

  it("has Cancel and Salvar buttons", () => {
    renderModal({ collaborator: defaultCollaborator });
    expect(
      screen.getByRole("button", { name: /cancelar/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /salvar/i })).toBeInTheDocument();
  });

  it("calls updateCollaborator and onClose when form is submitted", async () => {
    mockMutateAsync.mockResolvedValue(undefined);
    const user = userEvent.setup();
    renderModal({ collaborator: defaultCollaborator });

    const saveButton = screen.getByRole("button", { name: /salvar/i });
    await user.click(saveButton);

    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalledWith({
        id: "c1",
        data: expect.objectContaining({
          name: "João Silva",
          email: "joao@example.com",
          department: "engineering",
          isActive: true,
          occupation: "Desenvolvedor",
          startDate: "2024-01-15",
          level: "junior",
          managerId: "m1",
          baseSalary: 5000,
        }),
      });
    });
    await waitFor(() => {
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  it("dialog has correct aria-labelledby", () => {
    renderModal({ collaborator: defaultCollaborator });
    const dialog = screen.getByRole("dialog", { name: /editar colaborador/i });
    expect(dialog).toHaveAttribute(
      "aria-labelledby",
      "edit-collaborator-dialog-title",
    );
  });

  it("displays error message when update fails", () => {
    defaultUpdateReturn.isError = true;
    defaultUpdateReturn.error = new Error("E-mail já em uso");
    renderModal({ collaborator: defaultCollaborator });
    expect(screen.getByRole("alert")).toHaveTextContent("E-mail já em uso");
  });
});
