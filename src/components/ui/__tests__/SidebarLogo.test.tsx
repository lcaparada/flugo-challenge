import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { SidebarLogo } from "../SidebarLogo";

describe("SidebarLogo", () => {
  it("renders the logo image", () => {
    render(<SidebarLogo />);
    const logo = screen.getByRole("img", { name: /logo/i });
    expect(logo).toBeInTheDocument();
  });

  it("has the correct image source", () => {
    render(<SidebarLogo />);
    const logo = screen.getByRole("img", { name: /logo/i });
    expect(logo).toHaveAttribute("src", "/logo2.png");
  });

  it("has the correct alt text", () => {
    render(<SidebarLogo />);
    const logo = screen.getByRole("img", { name: /logo/i });
    expect(logo).toHaveAttribute("alt", "logo");
  });

  it("applies cursor-pointer class to the container", () => {
    render(<SidebarLogo />);
    const logo = screen.getByRole("img", { name: /logo/i });
    const container = logo.parentElement;
    expect(container).toHaveClass("cursor-pointer");
  });
});
