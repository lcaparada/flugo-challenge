import { Avatar, Box } from "@mui/material";

export function PageHeader() {
  return (
    <Box
      component="header"
      sx={{
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "flex-end",
        width: "100%",
        mb: 4,
      }}
    >
      <Avatar alt="User" src="/static/images/avatar/1.jpg" />
    </Box>
  );
}
