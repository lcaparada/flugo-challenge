import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Home } from "@mui/icons-material";
import { SidebarNavItem } from "../SidebarNavItem";

function renderNavItem(props = {}) {
  const defaultProps = {
    to: "/",
    label: "Test Label",
    icon: <Home data-testid="test-icon" />,
  };

  return render(
    <MemoryRouter>
      <SidebarNavItem {...defaultProps} {...props} />
    </MemoryRouter>,
  );
}

describe("SidebarNavItem", () => {
  it("renders the navigation item with label", () => {
    renderNavItem();
    expect(screen.getByText("Test Label")).toBeInTheDocument();
  });

  it("renders the link with correct href", () => {
    renderNavItem({ to: "/test-path", label: "My Link" });
    const link = screen.getByRole("link", { name: /my link/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/test-path");
  });

  it("renders the provided icon", () => {
    renderNavItem();
    expect(screen.getByTestId("test-icon")).toBeInTheDocument();
  });

  it("renders the ChevronRight icon", () => {
    const { container } = renderNavItem();
    const chevronIcon = container.querySelector(
      '[data-testid="ChevronRightIcon"]',
    );
    expect(chevronIcon).toBeInTheDocument();
  });

  it("applies the correct text color class", () => {
    renderNavItem({ label: "Color Test" });
    const labelElement = screen.getByText("Color Test");
    expect(labelElement).toHaveClass("text-sidebar-text");
  });

  it("applies cursor-pointer to the container", () => {
    const { container } = renderNavItem();
    const navContainer = container.querySelector(".cursor-pointer");
    expect(navContainer).toBeInTheDocument();
  });
});
