import { TextField, type TextFieldProps } from "@mui/material";
import {
  Controller,
  type FieldValues,
  type UseControllerProps,
} from "react-hook-form";

interface InputFormProps<FormType extends FieldValues>
  extends
    UseControllerProps<FormType>,
    Omit<TextFieldProps, "name" | "defaultValue"> {
  label: string;
}
export function InputForm<FormType extends FieldValues>({
  name,
  control,
  label,
  sx,
  ...props
}: InputFormProps<FormType>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <TextField
          {...field}
          {...props}
          label={label}
          fullWidth
          variant="outlined"
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
            },
            ...sx,
          }}
        />
      )}
    />
  );
}
