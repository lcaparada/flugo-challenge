import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ErrorMessage } from "../ErrorMessage";

describe("ErrorMessage", () => {
  it("renders the message text", () => {
    render(<ErrorMessage message="Algo deu errado." />);

    expect(screen.getByText("Algo deu errado.")).toBeInTheDocument();
  });

  it("has role alert and aria-live assertive on wrapper", () => {
    const { container } = render(<ErrorMessage message="Erro" />);

    const wrapper = container.querySelector("[role='alert'][aria-live='assertive']");
    expect(wrapper).toBeInTheDocument();
  });

  it("renders MUI Alert with error severity", () => {
    const { container } = render(<ErrorMessage message="Falha na rede" />);

    const alert = container.querySelector(".MuiAlert-root");
    expect(alert).toBeInTheDocument();
    expect(alert).toHaveClass("MuiAlert-standardError");
  });

  it("renders different messages correctly", () => {
    const { rerender } = render(<ErrorMessage message="Primeira mensagem" />);
    expect(screen.getByText("Primeira mensagem")).toBeInTheDocument();

    rerender(<ErrorMessage message="Segunda mensagem" />);
    expect(screen.getByText("Segunda mensagem")).toBeInTheDocument();
    expect(screen.queryByText("Primeira mensagem")).not.toBeInTheDocument();
  });

  it("renders with MUI Box as root", () => {
    const { container } = render(<ErrorMessage message="Erro" />);

    expect(container.querySelector(".MuiBox-root")).toBeInTheDocument();
  });
});
