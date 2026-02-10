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
    const avatar = screen.getByAltText("Foto do usuário");
    expect(avatar).toBeInTheDocument();
  });

  it("Avatar has correct src attribute", () => {
    render(<PageHeader />);
    const avatar = screen.getByAltText("Foto do usuário");
    expect(avatar).toHaveAttribute("src", "/static/images/avatar/1.jpg");
  });

  it("renders consistently", () => {
    const { container: container1 } = render(<PageHeader />);
    const { container: container2 } = render(<PageHeader />);

    expect(container1.innerHTML).toBe(container2.innerHTML);
  });
});
