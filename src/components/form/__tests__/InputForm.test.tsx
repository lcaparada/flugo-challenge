import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useForm } from "react-hook-form";
import { InputForm } from "../InputForm";

function TestWrapper() {
  const { control } = useForm({
    defaultValues: {
      testField: "",
    },
  });

  return (
    <InputForm
      name="testField"
      control={control}
      label="Test Label"
      placeholder="Test placeholder"
    />
  );
}

describe("InputForm", () => {
  it("renders the input field with label", () => {
    render(<TestWrapper />);
    const input = screen.getByLabelText("Test Label");
    expect(input).toBeInTheDocument();
  });

  it("renders with placeholder", () => {
    render(<TestWrapper />);
    const input = screen.getByPlaceholderText("Test placeholder");
    expect(input).toBeInTheDocument();
  });

  it("has correct default variant (outlined)", () => {
    render(<TestWrapper />);
    const input = screen.getByLabelText("Test Label");
    expect(input.closest(".MuiOutlinedInput-root")).toBeInTheDocument();
  });

  it("is fullWidth by default", () => {
    const { container } = render(<TestWrapper />);
    const textField = container.querySelector(".MuiTextField-root");
    expect(textField).toHaveClass("MuiFormControl-fullWidth");
  });

  it("has border radius styling applied", () => {
    const { container } = render(<TestWrapper />);
    const outlinedInput = container.querySelector(".MuiOutlinedInput-root");
    expect(outlinedInput).toBeInTheDocument();
  });

  it("allows user input", async () => {
    const user = userEvent.setup();
    render(<TestWrapper />);
    const input = screen.getByLabelText("Test Label") as HTMLInputElement;

    await user.type(input, "Test value");
    expect(input.value).toBe("Test value");
  });

  it("renders with error state", () => {
    function TestWrapperWithError() {
      const { control } = useForm({
        defaultValues: {
          testField: "",
        },
      });

      return (
        <InputForm
          name="testField"
          control={control}
          label="Test Label"
          error={true}
          helperText="Error message"
        />
      );
    }

    render(<TestWrapperWithError />);
    const errorText = screen.getByText("Error message");
    expect(errorText).toBeInTheDocument();
  });

  it("accepts different input types", () => {
    function TestWrapperWithType() {
      const { control } = useForm({
        defaultValues: {
          email: "",
        },
      });

      return (
        <InputForm name="email" control={control} label="Email" type="email" />
      );
    }

    render(<TestWrapperWithType />);
    const input = screen.getByLabelText("Email");
    expect(input).toHaveAttribute("type", "email");
  });
});
