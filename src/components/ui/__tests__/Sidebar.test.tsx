import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Sidebar } from "../Sidebar";

function renderSidebar(props = {}) {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
  };

  return render(
    <MemoryRouter>
      <Sidebar {...defaultProps} {...props} />
    </MemoryRouter>,
  );
}

describe("Sidebar", () => {
  it("renders the sidebar navigation", () => {
    renderSidebar();
    const nav = screen.getByRole("navigation");
    expect(nav).toBeInTheDocument();
  });

  it("renders the logo image", () => {
    renderSidebar();
    const logo = screen.getByRole("img", { name: /logo/i });
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute("src", "/logo2.png");
  });

  it("renders the Colaboradores link", () => {
    renderSidebar();
    const link = screen.getByRole("link", { name: /colaboradores/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/");
  });

  it("applies expected layout classes to the nav", () => {
    renderSidebar();
    const nav = screen.getByRole("navigation");
    expect(nav).toHaveClass(
      "bg-sidebar-bg",
      "border-sidebar-border",
      "min-h-screen",
    );
  });
});
