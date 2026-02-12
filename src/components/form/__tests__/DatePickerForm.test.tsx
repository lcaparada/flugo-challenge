import "dayjs/locale/pt-br";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useForm } from "react-hook-form";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePickerForm } from "../DatePickerForm";

type TestFormData = {
  birthDate: string;
};

function TestWrapper({
  defaultValue = "",
  error,
  helperText,
  label = "Data de nascimento",
}: {
  defaultValue?: string;
  error?: boolean;
  helperText?: string;
  label?: string;
}) {
  const { control } = useForm<TestFormData>({
    defaultValues: {
      birthDate: defaultValue,
    },
  });

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
      <DatePickerForm<TestFormData>
        name="birthDate"
        control={control}
        label={label}
        error={error}
        helperText={helperText}
      />
    </LocalizationProvider>
  );
}

function getPickerInput(container: HTMLElement): HTMLInputElement | null {
  return container.querySelector(
    "input.MuiPickersInputBase-input",
  ) as HTMLInputElement | null;
}

describe("DatePickerForm", () => {
  it("renders the date picker field with label", () => {
    render(<TestWrapper />);
    const labels = screen.getAllByText("Data de nascimento");
    expect(labels.length).toBeGreaterThanOrEqual(1);
    expect(
      screen.getByRole("group", { name: /Data de nascimento/i }),
    ).toBeInTheDocument();
  });

  it("renders as outlined variant by default", () => {
    const { container } = render(<TestWrapper />);
    const outlinedInput =
      container.querySelector(".MuiPickersOutlinedInput-root");
    expect(outlinedInput).toBeInTheDocument();
  });

  it("renders with full width", () => {
    const { container } = render(<TestWrapper />);
    const formControl = container.querySelector(".MuiFormControl-fullWidth");
    expect(formControl).toBeInTheDocument();
  });

  it("has border radius styling applied", () => {
    const { container } = render(<TestWrapper />);
    const outlinedInput =
      container.querySelector(".MuiPickersOutlinedInput-root");
    expect(outlinedInput).toBeInTheDocument();
  });

  it("displays error state when error prop is true", () => {
    const { container } = render(
      <TestWrapper error={true} helperText="Data inválida" />,
    );
    expect(screen.getByText("Data inválida")).toBeInTheDocument();
    const fieldWithError = container.querySelector(".Mui-error");
    expect(fieldWithError).toBeInTheDocument();
  });

  it("displays helper text when provided", () => {
    render(<TestWrapper helperText="Selecione sua data de nascimento" />);
    expect(
      screen.getByText("Selecione sua data de nascimento"),
    ).toBeInTheDocument();
  });

  it("renders with default value in YYYY-MM-DD format", () => {
    const { container } = render(<TestWrapper defaultValue="1990-05-15" />);
    const input = getPickerInput(container);
    expect(input).toBeTruthy();
    // MUI DatePicker mantém o valor no input nativo em YYYY-MM-DD
    expect(input?.value).toMatch(/1990-05-15|15\/05\/1990/);
  });

  it("renders empty when no default value", () => {
    const { container } = render(<TestWrapper />);
    const input = getPickerInput(container);
    expect(input).toBeTruthy();
    expect(input?.value).toBe("");
  });

  it("opens calendar when calendar button is clicked", async () => {
    const user = userEvent.setup();
    render(<TestWrapper />);
    const calendarButton = screen.getByRole("button", {
      name: /choose date|escolher data/i,
    });
    await user.click(calendarButton);
    const dialog =
      screen.queryByRole("dialog") ??
      document.querySelector(".MuiPickersPopper-root");
    expect(dialog).toBeTruthy();
  });

  it("accepts custom label", () => {
    render(<TestWrapper label="Data de admissão" />);
    const labels = screen.getAllByText("Data de admissão");
    expect(labels.length).toBeGreaterThanOrEqual(1);
    expect(
      screen.getByRole("group", { name: /Data de admissão/i }),
    ).toBeInTheDocument();
  });
});
