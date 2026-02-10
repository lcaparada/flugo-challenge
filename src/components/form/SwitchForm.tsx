import { FormControlLabel, Switch } from "@mui/material";
import {
  Controller,
  type FieldValues,
  type UseControllerProps,
} from "react-hook-form";

interface SwitchFormProps<
  FormType extends FieldValues,
> extends UseControllerProps<FormType> {
  label: string;
}

export function SwitchForm<FormType extends FieldValues>({
  name,
  control,
  label,
}: SwitchFormProps<FormType>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <FormControlLabel
          control={
            <Switch
              checked={field.value}
              onChange={(e) => field.onChange(e.target.checked)}
              color="primary"
            />
          }
          label={label}
        />
      )}
    />
  );
}
