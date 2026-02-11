import { Box, Button, Typography } from "@mui/material";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";

type EmptyStateProps = {
  title: string;
  description: string;
  primaryAction?: {
    label: string;
    onClick: () => void;
  };
};

export function EmptyState({
  title,
  description,
  primaryAction,
}: EmptyStateProps) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        py: 8,
        px: 2,
        borderWidth: 1,
        borderColor: "divider",
        borderStyle: "solid",
        borderRadius: 4,
        boxShadow: "5px 3px 12px -9px #000000",
        bgcolor: "background.paper",
      }}
      role="status"
      aria-label={title}
    >
      <PeopleOutlineIcon
        sx={{
          fontSize: 64,
          color: "grey.400",
          mb: 2,
        }}
        aria-hidden
      />
      <Typography
        variant="h6"
        component="p"
        sx={{
          fontWeight: 600,
          color: "text.primary",
          textAlign: "center",
          mb: 0.5,
        }}
      >
        {title}
      </Typography>
      <Typography
        variant="body2"
        sx={{
          color: "text.secondary",
          textAlign: "center",
          mb: primaryAction ? 3 : 0,
          maxWidth: 320,
        }}
      >
        {description}
      </Typography>
      {primaryAction && (
        <Button
          variant="contained"
          color="primary"
          onClick={primaryAction.onClick}
          sx={{ textTransform: "none", fontWeight: 600 }}
          aria-label={primaryAction.label}
        >
          {primaryAction.label}
        </Button>
      )}
    </Box>
  );
}
