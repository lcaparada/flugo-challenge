import { Box, Alert } from "@mui/material";

type ErrorMessageProps = {
  message: string;
};

export function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        bgcolor: "background.default",
        p: 4,
      }}
      role="alert"
      aria-live="assertive"
    >
      <Alert severity="error">{message}</Alert>
    </Box>
  );
}
