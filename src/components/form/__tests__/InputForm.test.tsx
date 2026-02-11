import { describe, it, expect, vi } from "vitest";
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

  describe("when type is password", () => {
    function PasswordWrapper() {
      const { control } = useForm({
        defaultValues: { password: "" },
      });
      return (
        <InputForm
          name="password"
          control={control}
          label="Senha"
          type="password"
        />
      );
    }

    it("renders the password visibility toggle button", () => {
      render(<PasswordWrapper />);
      const toggleButton = screen.getByRole("button", {
        name: /ocultar senha|exibir senha/i,
      });
      expect(toggleButton).toBeInTheDocument();
    });

    it("renders input as type password initially", () => {
      render(<PasswordWrapper />);
      const input = screen.getByLabelText("Senha");
      expect(input).toHaveAttribute("type", "password");
    });

    it("toggles to visible (type text) when button is clicked", async () => {
      const user = userEvent.setup();
      render(<PasswordWrapper />);
      const toggleButton = screen.getByRole("button", {
        name: /ocultar senha|exibir senha/i,
      });
      const input = screen.getByLabelText("Senha");

      await user.click(toggleButton);

      expect(input).toHaveAttribute("type", "text");
    });

    it("toggles back to password when button is clicked twice", async () => {
      const user = userEvent.setup();
      render(<PasswordWrapper />);
      const toggleButton = screen.getByRole("button", {
        name: /ocultar senha|exibir senha/i,
      });
      const input = screen.getByLabelText("Senha");

      await user.click(toggleButton);
      expect(input).toHaveAttribute("type", "text");

      await user.click(toggleButton);
      expect(input).toHaveAttribute("type", "password");
    });

    it("does not submit form when clicking the toggle (button has type button)", async () => {
      const user = userEvent.setup();
      const onSubmit = vi.fn();
      function PasswordFormWrapper() {
        const { control, handleSubmit } = useForm({
          defaultValues: { password: "" },
        });
        return (
          <form onSubmit={handleSubmit(onSubmit)}>
            <InputForm
              name="password"
              control={control}
              label="Senha"
              type="password"
            />
            <button type="submit">Enviar</button>
          </form>
        );
      }
      render(<PasswordFormWrapper />);
      const toggleButton = screen.getByRole("button", {
        name: /ocultar senha|exibir senha/i,
      });
      await user.click(toggleButton);
      expect(onSubmit).not.toHaveBeenCalled();
    });
  });

  it("does not render visibility toggle when type is not password", () => {
    render(<TestWrapper />);
    expect(
      screen.queryByRole("button", { name: /ocultar senha|exibir senha/i }),
    ).not.toBeInTheDocument();
  });
});
