import { TextField, MenuItem, type TextFieldProps } from "@mui/material";
import {
  Controller,
  type FieldValues,
  type UseControllerProps,
} from "react-hook-form";

interface SelectFormProps<FormType extends FieldValues>
  extends
    UseControllerProps<FormType>,
    Omit<TextFieldProps, "name" | "defaultValue"> {
  label: string;
  options: Array<{ value: string; label: string }>;
}

export function SelectForm<FormType extends FieldValues>({
  name,
  control,
  label,
  options,
  sx,
  ...props
}: SelectFormProps<FormType>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <TextField
          {...field}
          {...props}
          select
          label={label}
          fullWidth
          variant="outlined"
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
            },
            ...sx,
          }}
        >
          {options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      )}
    />
  );
}
