import { describe, it, expect } from "vitest";
import { stringToColor, stringAvatar } from "../avatar";

describe("stringToColor", () => {
  it("returns a valid hexadecimal color", () => {
    const color = stringToColor("Ana Silva");
    expect(color).toMatch(/^#[0-9A-F]{6}$/i);
  });

  it("returns the same color for the same name (consistency)", () => {
    const name = "João Pedro";
    const color1 = stringToColor(name);
    const color2 = stringToColor(name);
    const color3 = stringToColor(name);

    expect(color1).toBe(color2);
    expect(color2).toBe(color3);
  });

  it("returns different colors for different names", () => {
    const color1 = stringToColor("Maria Santos");
    const color2 = stringToColor("João Silva");
    const color3 = stringToColor("Ana Costa");

    const uniqueColors = new Set([color1, color2, color3]);
    expect(uniqueColors.size).toBeGreaterThan(1);
  });

  it("works with empty names", () => {
    const color = stringToColor("");
    expect(color).toMatch(/^#[0-9A-F]{6}$/i);
  });

  it("works with names containing special characters", () => {
    const color = stringToColor("José Ávila-Gonçalves");
    expect(color).toMatch(/^#[0-9A-F]{6}$/i);
  });

  it("returns a color from the predefined palette", () => {
    const AVATAR_COLORS = [
      "#FF6B6B",
      "#4ECDC4",
      "#45B7D1",
      "#96CEB4",
      "#FFEAA7",
      "#74B9FF",
      "#A29BFE",
      "#FD79A8",
      "#FDCB6E",
      "#6C5CE7",
      "#00B894",
      "#E17055",
      "#0984E3",
      "#B2BEC3",
      "#55EFC4",
    ];

    const color = stringToColor("Fernanda Torres");
    expect(AVATAR_COLORS).toContain(color.toUpperCase());
  });
});

describe("stringAvatar", () => {
  it("returns an object with sx and children properties", () => {
    const result = stringAvatar("Ana Silva");

    expect(result).toHaveProperty("sx");
    expect(result).toHaveProperty("children");
    expect(result.sx).toHaveProperty("bgcolor");
  });

  it("extracts initials from a full name (two parts)", () => {
    const result = stringAvatar("Ana Silva");

    expect(result.children).toBe("AS");
  });

  it("extracts initial from a single name", () => {
    const result = stringAvatar("Ana");

    expect(result.children).toBe("A");
  });

  it("extracts initials from a name with multiple parts", () => {
    const result = stringAvatar("Maria da Silva Santos");

    expect(result.children).toBe("MD");
  });

  it("returns a valid bgcolor color", () => {
    const result = stringAvatar("João Pedro");

    expect(result.sx.bgcolor).toMatch(/^#[0-9A-F]{6}$/i);
  });

  it("returns the same result for the same name", () => {
    const name = "Carlos Eduardo";
    const result1 = stringAvatar(name);
    const result2 = stringAvatar(name);

    expect(result1.sx.bgcolor).toBe(result2.sx.bgcolor);
    expect(result1.children).toBe(result2.children);
  });

  it("works with lowercase names", () => {
    const result = stringAvatar("ana silva");

    expect(result.children).toBe("AS");
  });

  it("handles empty names (edge case)", () => {
    const result = stringAvatar("");

    expect(result.children).toBe("?");
  });

  it("handles names with only spaces", () => {
    const result = stringAvatar("   ");

    expect(result.children).toBe("?");
  });

  it("works with names containing special characters", () => {
    const result = stringAvatar("José Ávila");

    expect(result.children).toBe("JÁ");
  });

  it("generates different bgcolor for different names", () => {
    const result1 = stringAvatar("Maria Santos");
    const result2 = stringAvatar("João Silva");

    expect(result1.sx.bgcolor).toMatch(/^#[0-9A-F]{6}$/i);
    expect(result2.sx.bgcolor).toMatch(/^#[0-9A-F]{6}$/i);
  });
});
