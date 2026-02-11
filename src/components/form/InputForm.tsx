import { useState } from "react";
import {
  IconButton,
  InputAdornment,
  TextField,
  type TextFieldProps,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
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
  type,
  sx,
  ...props
}: InputFormProps<FormType>) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <TextField
          {...field}
          {...props}
          type={isPassword ? (showPassword ? "text" : "password") : type}
          label={label}
          fullWidth
          variant="outlined"
          slotProps={{
            input: {
              endAdornment: isPassword ? (
                <InputAdornment position="end">
                  <IconButton
                    type="button"
                    aria-label="Ocultar senha"
                    onClick={() => setShowPassword((prev) => !prev)}
                    onMouseDown={(e) => e.preventDefault()}
                    edge="end"
                  >
                    {showPassword ? (
                      <VisibilityOff fontSize="small" />
                    ) : (
                      <Visibility fontSize="small" />
                    )}
                  </IconButton>
                </InputAdornment>
              ) : undefined,
            },
          }}
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
