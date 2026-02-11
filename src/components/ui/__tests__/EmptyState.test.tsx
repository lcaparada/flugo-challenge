import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { EmptyState } from "../EmptyState";

describe("EmptyState", () => {
  it("renders title and description", () => {
    render(
      <EmptyState
        title="Nenhum item"
        description="Adicione o primeiro item."
      />,
    );

    expect(screen.getByText("Nenhum item")).toBeInTheDocument();
    expect(screen.getByText("Adicione o primeiro item.")).toBeInTheDocument();
  });

  it("renders without primary action when not provided", () => {
    render(
      <EmptyState
        title="Título"
        description="Descrição"
      />,
    );

    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("renders primary action button when provided", () => {
    render(
      <EmptyState
        title="Título"
        description="Descrição"
        primaryAction={{ label: "Adicionar", onClick: () => {} }}
      />,
    );

    const button = screen.getByRole("button", { name: /adicionar/i });
    expect(button).toBeInTheDocument();
  });

  it("calls primaryAction.onClick when button is clicked", async () => {
    const onAction = vi.fn();
    render(
      <EmptyState
        title="Título"
        description="Descrição"
        primaryAction={{ label: "Adicionar", onClick: onAction }}
      />,
    );

    await userEvent.click(screen.getByRole("button", { name: /adicionar/i }));

    expect(onAction).toHaveBeenCalledTimes(1);
  });

  it("has role status and aria-label with title", () => {
    render(
      <EmptyState
        title="Estado vazio"
        description="Descrição"
      />,
    );

    const status = screen.getByRole("status", { name: /estado vazio/i });
    expect(status).toBeInTheDocument();
  });

  it("renders icon (visually hidden from accessibility tree)", () => {
    const { container } = render(
      <EmptyState title="Título" description="Descrição" />,
    );

    const icon = container.querySelector("[aria-hidden='true']");
    expect(icon).toBeInTheDocument();
  });

  it("renders with MUI Box as root", () => {
    const { container } = render(
      <EmptyState title="Título" description="Descrição" />,
    );

    expect(container.querySelector(".MuiBox-root")).toBeInTheDocument();
  });
});
