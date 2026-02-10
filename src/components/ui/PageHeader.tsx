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
        mb: { xs: 2, sm: 3, md: 4 },
      }}
      role="banner"
    >
      <Avatar
        alt="Foto do usuário"
        src="/static/images/avatar/1.jpg"
        sx={{
          width: { xs: 32, sm: 40 },
          height: { xs: 32, sm: 40 },
        }}
      />
    </Box>
  );
}
