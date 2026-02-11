import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Loading } from "../Loading";

describe("Loading", () => {
  it("renders container with role status and aria-label", () => {
    render(<Loading />);

    const status = screen.getByRole("status", { name: /carregando/i });
    expect(status).toBeInTheDocument();
  });

  it("renders CircularProgress", () => {
    const { container } = render(<Loading />);

    expect(container.querySelector(".MuiCircularProgress-root")).toBeInTheDocument();
  });

  it("renders with MUI Box as root", () => {
    const { container } = render(<Loading />);

    expect(container.querySelector(".MuiBox-root")).toBeInTheDocument();
  });

  it("renders consistently", () => {
    const { container: c1 } = render(<Loading />);
    const { container: c2 } = render(<Loading />);

    expect(c1.innerHTML).toBe(c2.innerHTML);
  });
});
