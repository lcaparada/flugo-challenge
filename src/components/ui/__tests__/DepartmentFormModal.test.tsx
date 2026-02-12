import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { DepartmentFormModal } from "../DepartmentFormModal";
import type { Department } from "@/types/department";
import type { Collaborator } from "@/types/collaborator";

const mockOnClose = vi.fn();
const mockCreateMutate = vi.fn();
const mockUpdateMutate = vi.fn();

const defaultCreateReturn = {
  mutateAsync: mockCreateMutate,
  isPending: false,
  isError: false,
  error: null as Error | null,
};
const defaultUpdateReturn = {
  mutateAsync: mockUpdateMutate,
  isPending: false,
  isError: false,
  error: null as Error | null,
};

vi.mock("@/useCases", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/useCases")>();
  return {
    ...actual,
    useCreateDepartment: () => ({ ...defaultCreateReturn }),
    useUpdateDepartment: () => ({ ...defaultUpdateReturn }),
  };
});

const defaultCollaborators: Collaborator[] = [
  {
    id: "c1",
    name: "Maria Silva",
    email: "maria@example.com",
    department: "",
    isActive: true,
    occupation: "Dev",
    startDate: "2024-01-01",
    level: "gestor",
    managerId: "",
  },
  {
    id: "c2",
    name: "João Santos",
    email: "joao@example.com",
    department: "",
    isActive: true,
    occupation: "Designer",
    startDate: "2024-02-01",
    level: "junior",
    managerId: "c1",
  },
];

const defaultDepartments: Department[] = [
  {
    id: "d1",
    name: "Engenharia",
    collaboratorIds: ["c2"],
    managerId: "c1",
  },
];

const defaultDepartment: Department = {
  id: "d1",
  name: "Engenharia",
  collaboratorIds: ["c2"],
  managerId: "c1",
};

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
});

function renderModal(props: {
  open?: boolean;
  onClose?: () => void;
  department?: Department | null;
  collaborators?: Collaborator[];
  departments?: Department[];
}) {
  return render(
    <QueryClientProvider client={queryClient}>
      <DepartmentFormModal
        open={props.open ?? true}
        onClose={props.onClose ?? mockOnClose}
        department={props.department ?? null}
        collaborators={props.collaborators ?? defaultCollaborators}
        departments={props.departments ?? defaultDepartments}
      />
    </QueryClientProvider>,
  );
}

describe("DepartmentFormModal", () => {
  beforeEach(() => {
    mockOnClose.mockClear();
    mockCreateMutate.mockClear();
    mockUpdateMutate.mockClear();
    defaultCreateReturn.isPending = false;
    defaultCreateReturn.isError = false;
    defaultCreateReturn.error = null;
    defaultUpdateReturn.isPending = false;
    defaultUpdateReturn.isError = false;
    defaultUpdateReturn.error = null;
  });

  it("renders dialog with title Novo departamento when department is null", () => {
    renderModal({ department: null });
    expect(
      screen.getByRole("dialog", { name: /novo departamento/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /novo departamento/i }),
    ).toBeInTheDocument();
  });

  it("renders dialog with title Editar departamento when department is provided", () => {
    renderModal({ department: defaultDepartment });
    expect(
      screen.getByRole("dialog", { name: /editar departamento/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /editar departamento/i }),
    ).toBeInTheDocument();
  });

  it("renders Nome field with placeholder", () => {
    renderModal({ department: null });
    const nameInput = screen.getByLabelText(/nome/i);
    expect(nameInput).toBeInTheDocument();
    expect(nameInput).toHaveAttribute("placeholder", "Ex.: Engenharia");
  });

  it("pre-fills form when editing department", () => {
    renderModal({ department: defaultDepartment });
    const nameInput = screen.getByLabelText(/nome/i) as HTMLInputElement;
    expect(nameInput.value).toBe("Engenharia");
  });

  it("renders Gestor responsável select", () => {
    renderModal({ department: null });
    expect(
      screen.getByLabelText(/gestor responsável/i),
    ).toBeInTheDocument();
  });

  it("renders Colaboradores section", () => {
    renderModal({ department: null });
    expect(screen.getByText("Colaboradores")).toBeInTheDocument();
  });

  it("shows Nenhum colaborador adicionado when no collaborators in create mode", () => {
    renderModal({ department: null });
    expect(screen.getByText(/nenhum colaborador adicionado/i)).toBeInTheDocument();
  });

  it("shows collaborator chips when editing department with collaboratorIds", () => {
    renderModal({ department: defaultDepartment });
    expect(screen.getByText("João Santos")).toBeInTheDocument();
  });

  it("calls onClose when Cancelar is clicked", async () => {
    const user = userEvent.setup();
    renderModal({ department: null });
    const cancelButton = screen.getByRole("button", { name: /cancelar/i });
    await user.click(cancelButton);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("has Criar button in create mode and Salvar in edit mode", () => {
    renderModal({ department: null });
    expect(screen.getByRole("button", { name: /criar/i })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /salvar/i })).not.toBeInTheDocument();
  });

  it("has Salvar button in edit mode", () => {
    renderModal({ department: defaultDepartment });
    expect(screen.getByRole("button", { name: /salvar/i })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /criar/i })).not.toBeInTheDocument();
  });

  it("submit button is disabled when name is empty", () => {
    renderModal({ department: null });
    const nameInput = screen.getByLabelText(/nome/i);
    expect(nameInput).toHaveValue("");
    const submitButton = screen.getByRole("button", { name: /criar/i });
    expect(submitButton).toBeDisabled();
  });

  it("calls createDepartment and onClose when submitting in create mode", async () => {
    mockCreateMutate.mockResolvedValue("new-id");
    const user = userEvent.setup();
    renderModal({ department: null });

    await user.type(screen.getByLabelText(/nome/i), "Marketing");
    const createButton = screen.getByRole("button", { name: /criar/i });
    await user.click(createButton);

    await waitFor(() => {
      expect(mockCreateMutate).toHaveBeenCalledWith({
        name: "Marketing",
        managerId: "",
        collaboratorIds: [],
      });
    });
    await waitFor(() => {
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  it("calls updateDepartment and onClose when submitting in edit mode", async () => {
    mockUpdateMutate.mockResolvedValue(undefined);
    const user = userEvent.setup();
    renderModal({ department: defaultDepartment });

    const saveButton = screen.getByRole("button", { name: /salvar/i });
    await user.click(saveButton);

    await waitFor(() => {
      expect(mockUpdateMutate).toHaveBeenCalledWith({
        id: "d1",
        data: {
          name: "Engenharia",
          managerId: "c1",
          collaboratorIds: ["c2"],
        },
        removedTransfers: undefined,
      });
    });
    await waitFor(() => {
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  it("displays error message when create fails", () => {
    defaultCreateReturn.isError = true;
    defaultCreateReturn.error = new Error("Falha ao criar");
    renderModal({ department: null });
    expect(screen.getByRole("alert")).toHaveTextContent("Falha ao criar");
  });

  it("displays error message when update fails", () => {
    defaultUpdateReturn.isError = true;
    defaultUpdateReturn.error = new Error("Falha ao atualizar");
    renderModal({ department: defaultDepartment });
    expect(screen.getByRole("alert")).toHaveTextContent("Falha ao atualizar");
  });

  it("dialog has correct aria-labelledby", () => {
    renderModal({ department: null });
    const dialog = screen.getByRole("dialog", { name: /novo departamento/i });
    expect(dialog).toHaveAttribute(
      "aria-labelledby",
      "department-form-dialog-title",
    );
  });
});
