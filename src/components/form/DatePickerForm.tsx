import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import type { DatePickerProps } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import {
  Controller,
  type FieldValues,
  type UseControllerProps,
} from "react-hook-form";

interface DatePickerFormProps extends Omit<
  DatePickerProps<boolean>,
  "value" | "onChange" | "onBlur" | "name" | "slotProps"
> {
  label: string;
  error?: boolean;
  helperText?: string;
}

export function DatePickerForm<FormType extends FieldValues>({
  name,
  control,
  label,
  error = false,
  helperText,
  maxDate,
  sx,
  ...props
}: DatePickerFormProps & UseControllerProps<FormType>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <DatePicker
          {...props}
          label={label}
          value={field.value ? dayjs(field.value) : null}
          onChange={(date) =>
            field.onChange(date ? date.format("YYYY-MM-DD") : "")
          }
          maxDate={maxDate}
          slotProps={{
            textField: {
              fullWidth: true,
              variant: "outlined",
              error,
              helperText,
              onBlur: field.onBlur,
              sx: {
                "& .MuiOutlinedInput-root, & .MuiPickersOutlinedInput-root": {
                  borderRadius: 2,
                },
                ...sx,
              },
            },
          }}
        />
      )}
    />
  );
}
