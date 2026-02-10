import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { PageHeader } from "../PageHeader";

describe("PageHeader", () => {
  it("renders the header element", () => {
    render(<PageHeader />);
    const header = screen.getByRole("banner");
    expect(header).toBeInTheDocument();
  });

  it("renders the Avatar component", () => {
    render(<PageHeader />);
    const avatar = screen.getByAltText("User");
    expect(avatar).toBeInTheDocument();
  });

  it("Avatar has correct src attribute", () => {
    render(<PageHeader />);
    const avatar = screen.getByAltText("User");
    expect(avatar).toHaveAttribute("src", "/static/images/avatar/1.jpg");
  });

  it("has correct layout classes", () => {
    render(<PageHeader />);
    const header = screen.getByRole("banner");
    expect(header).toHaveClass("items-end");
    expect(header).toHaveClass("w-full");
    expect(header).toHaveClass("flex");
    expect(header).toHaveClass("justify-end");
    expect(header).toHaveClass("mb-4");
  });

  it("renders consistently", () => {
    const { container: container1 } = render(<PageHeader />);
    const { container: container2 } = render(<PageHeader />);
    
    expect(container1.innerHTML).toBe(container2.innerHTML);
  });
});
