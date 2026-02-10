import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MenuButton } from "../MenuButton";

describe("MenuButton", () => {
  it("renders the button", () => {
    const mockOnClick = vi.fn();
    render(<MenuButton onClick={mockOnClick} />);

    const button = screen.getByRole("button", { name: /abrir menu/i });
    expect(button).toBeInTheDocument();
  });

  it("has the correct aria-label", () => {
    const mockOnClick = vi.fn();
    render(<MenuButton onClick={mockOnClick} />);

    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("aria-label", "Abrir menu");
  });

  it("calls onClick when clicked", async () => {
    const user = userEvent.setup();
    const mockOnClick = vi.fn();
    render(<MenuButton onClick={mockOnClick} />);

    const button = screen.getByRole("button", { name: /abrir menu/i });
    await user.click(button);

    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it("renders the Menu icon", () => {
    const mockOnClick = vi.fn();
    const { container } = render(<MenuButton onClick={mockOnClick} />);

    const menuIcon = container.querySelector('[data-testid="MenuIcon"]');
    expect(menuIcon).toBeInTheDocument();
  });

  it("renders with Material UI IconButton styling", () => {
    const mockOnClick = vi.fn();
    render(<MenuButton onClick={mockOnClick} />);

    const button = screen.getByRole("button");
    expect(button).toHaveClass("MuiIconButton-sizeMedium");
  });
});
