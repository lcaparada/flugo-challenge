import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import { ThemeProvider } from "@mui/material/styles";
import { Box } from "@mui/material";
import {} from "@tanstack/react-query";
import { theme } from "./theme/muiTheme";
import Home from "./pages/Home";
import CreateCollaborator from "./pages/CreateCollaborator";
import { MenuButton, Sidebar } from "./components";
import { QueryProvider } from "./providers";

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <QueryProvider>
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <Box
            sx={{
              display: "flex",
              minHeight: "100vh",
              overflow: "hidden",
            }}
          >
            <MenuButton onClick={() => setIsSidebarOpen(true)} />
            <Sidebar
              isOpen={isSidebarOpen}
              onClose={() => setIsSidebarOpen(false)}
            />
            <Box
              component="main"
              sx={{
                flex: 1,
                overflow: "hidden",
                width: "100%",
                maxWidth: "100%",
              }}
            >
              <Routes>
                <Route path="/" element={<Home />} />
                <Route
                  path="/colaboradores/novo"
                  element={<CreateCollaborator />}
                />
              </Routes>
            </Box>
          </Box>
        </BrowserRouter>
      </ThemeProvider>
    </QueryProvider>
  );
}
