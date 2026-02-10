import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import { ThemeProvider } from "@mui/material/styles";
import { Box } from "@mui/material";
import { theme } from "./theme/muiTheme";
import Home from "./pages/Home";
import CreateCollaborator from "./pages/CreateCollaborator";
import { MenuButton, Sidebar } from "./components";

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Box
          sx={{
            display: "flex",
            minHeight: "100vh",
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
            }}
          >
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/colaboradores/novo" element={<CreateCollaborator />} />
            </Routes>
          </Box>
        </Box>
      </BrowserRouter>
    </ThemeProvider>
  );
}
