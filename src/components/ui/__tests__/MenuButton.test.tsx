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

  it("applies md:hidden class to hide on desktop", () => {
    const mockOnClick = vi.fn();
    render(<MenuButton onClick={mockOnClick} />);

    const button = screen.getByRole("button");
    expect(button).toHaveClass("md:hidden");
  });

  it("applies fixed positioning classes", () => {
    const mockOnClick = vi.fn();
    render(<MenuButton onClick={mockOnClick} />);

    const button = screen.getByRole("button");
    expect(button).toHaveClass("fixed", "top-4", "left-4");
  });

  it("applies background and border classes", () => {
    const mockOnClick = vi.fn();
    render(<MenuButton onClick={mockOnClick} />);

    const button = screen.getByRole("button");
    expect(button).toHaveClass("bg-sidebar-bg", "border-sidebar-border");
  });
});
