import { describe, it, expect } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useForm } from "react-hook-form";
import { SelectForm } from "../SelectForm";

type TestFormData = {
  department: string;
};

function TestComponent({
  error,
  helperText,
  options,
}: {
  error?: boolean;
  helperText?: string;
  options: Array<{ value: string; label: string }>;
}) {
  const { control } = useForm<TestFormData>({
    defaultValues: {
      department: "",
    },
  });

  return (
    <SelectForm
      name="department"
      control={control}
      label="Department"
      options={options}
      error={error}
      helperText={helperText}
    />
  );
}

describe("SelectForm", () => {
  const defaultOptions = [
    { value: "engineering", label: "Engineering" },
    { value: "design", label: "Design" },
    { value: "marketing", label: "Marketing" },
  ];

  it("renders the select field with label", () => {
    render(<TestComponent options={defaultOptions} />);
    expect(screen.getByLabelText(/department/i)).toBeInTheDocument();
  });

  it("renders as outlined variant by default", () => {
    render(<TestComponent options={defaultOptions} />);
    const selectField = screen.getByLabelText(/department/i);
    expect(selectField.closest(".MuiOutlinedInput-root")).toBeInTheDocument();
  });

  it("renders with full width", () => {
    render(<TestComponent options={defaultOptions} />);
    const selectField = screen.getByLabelText(/department/i);
    const textField = selectField.closest(".MuiTextField-root");
    expect(textField).toHaveClass("MuiFormControl-fullWidth");
  });

  it("has border radius styling", () => {
    const { container } = render(<TestComponent options={defaultOptions} />);
    const outlinedInput = container.querySelector(".MuiOutlinedInput-root");
    expect(outlinedInput).toBeInTheDocument();
  });

  it("allows user to select an option", async () => {
    const user = userEvent.setup();
    const { container } = render(<TestComponent options={defaultOptions} />);

    const selectField = screen.getByLabelText(/department/i);
    await user.click(selectField);

    await waitFor(() => {
      expect(screen.getByRole("option", { name: /engineering/i })).toBeInTheDocument();
    });

    await user.click(screen.getByRole("option", { name: /engineering/i }));

    await waitFor(() => {
      const hiddenInput = container.querySelector('input[name="department"]') as HTMLInputElement;
      expect(hiddenInput?.value).toBe("engineering");
    });
  });

  it("displays all provided options", async () => {
    const user = userEvent.setup();
    render(<TestComponent options={defaultOptions} />);

    const selectField = screen.getByLabelText(/department/i);
    await user.click(selectField);

    await waitFor(() => {
      expect(screen.getByRole("option", { name: /engineering/i })).toBeInTheDocument();
      expect(screen.getByRole("option", { name: /design/i })).toBeInTheDocument();
      expect(screen.getByRole("option", { name: /marketing/i })).toBeInTheDocument();
    });
  });

  it("displays error state when error prop is true", () => {
    render(
      <TestComponent
        options={defaultOptions}
        error={true}
        helperText="This field is required"
      />
    );

    expect(screen.getByText("This field is required")).toBeInTheDocument();
    const selectField = screen.getByLabelText(/department/i);
    expect(selectField.closest(".MuiOutlinedInput-root")).toHaveClass("Mui-error");
  });

  it("displays helper text", () => {
    render(
      <TestComponent
        options={defaultOptions}
        helperText="Please select your department"
      />
    );

    expect(screen.getByText("Please select your department")).toBeInTheDocument();
  });

  it("has hidden input for form submission", () => {
    const { container } = render(<TestComponent options={defaultOptions} />);
    const hiddenInput = container.querySelector('input[name="department"]');
    expect(hiddenInput).toBeInTheDocument();
    expect(hiddenInput).toHaveAttribute("aria-hidden", "true");
  });

  it("renders MenuItem components for each option", async () => {
    const user = userEvent.setup();
    render(<TestComponent options={defaultOptions} />);

    const selectField = screen.getByLabelText(/department/i);
    await user.click(selectField);

    await waitFor(() => {
      const options = screen.getAllByRole("option");
      expect(options).toHaveLength(3);
    });
  });
});
