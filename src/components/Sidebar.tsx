import { AccountBox } from "@mui/icons-material";
import SidebarLogo from "./SidebarLogo";
import SidebarNavItem from "./SidebarNavItem";

export default function Sidebar() {
  return (
    <nav className="w-1/6 bg-sidebar-bg min-h-screen p-6 border-r border-sidebar-border border-dashed">
      <SidebarLogo />
      <SidebarNavItem
        to="/"
        label="Colaboradores"
        icon={<AccountBox className="text-sidebar-text" />}
      />
    </nav>
  );
}
