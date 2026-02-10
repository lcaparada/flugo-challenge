import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useForm } from "react-hook-form";
import { SwitchForm } from "../SwitchForm";

function TestWrapper({ defaultValue = false }: { defaultValue?: boolean }) {
  const { control } = useForm({
    defaultValues: {
      testSwitch: defaultValue,
    },
  });

  return (
    <SwitchForm name="testSwitch" control={control} label="Test Switch Label" />
  );
}

describe("SwitchForm", () => {
  it("renders the switch with label", () => {
    render(<TestWrapper />);
    const label = screen.getByText("Test Switch Label");
    expect(label).toBeInTheDocument();
  });

  it("renders the switch input", () => {
    render(<TestWrapper />);
    const switchInput = screen.getByRole("switch");
    expect(switchInput).toBeInTheDocument();
  });

  it("switch is unchecked by default when defaultValue is false", () => {
    render(<TestWrapper defaultValue={false} />);
    const switchInput = screen.getByRole("switch") as HTMLInputElement;
    expect(switchInput.checked).toBe(false);
  });

  it("switch is checked when defaultValue is true", () => {
    render(<TestWrapper defaultValue={true} />);
    const switchInput = screen.getByRole("switch") as HTMLInputElement;
    expect(switchInput.checked).toBe(true);
  });

  it("toggles when clicked", async () => {
    const user = userEvent.setup();
    render(<TestWrapper defaultValue={false} />);
    const switchInput = screen.getByRole("switch") as HTMLInputElement;

    expect(switchInput.checked).toBe(false);

    await user.click(switchInput);
    expect(switchInput.checked).toBe(true);

    await user.click(switchInput);
    expect(switchInput.checked).toBe(false);
  });

  it("has primary color", () => {
    const { container } = render(<TestWrapper />);
    const switchBase = container.querySelector(".MuiSwitch-switchBase");
    expect(switchBase).toBeInTheDocument();
  });

  it("is accessible with proper label association", () => {
    render(<TestWrapper />);
    const switchInput = screen.getByRole("switch");
    const label = screen.getByText("Test Switch Label");

    // Check that label is associated with the switch
    expect(label.closest(".MuiFormControlLabel-root")).toContainElement(
      switchInput,
    );
  });
});
