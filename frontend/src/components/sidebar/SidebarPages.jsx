import { House, Layers, LayoutDashboard, ListOrdered, MessageCircleMore, ScanLine, Settings } from "lucide-react";
import Sidebar, { SidebarItem } from "./Sidebar";

const SidebarPages = () => {
    return (
        <Sidebar>
            <SidebarItem
                icon={<LayoutDashboard size={20} />}
                text="Dashboard"
                to="/"  // Mengarah ke halaman Dashboard
            />
            <SidebarItem
                icon={<ListOrdered size={20} />}
                text="Orderan"
                to="/orders"  // Mengarah ke halaman Item
            />
            {/* <SidebarItem
                icon={<ScanLine size={20} />}
                text="Scanner"
                to="/scanner"  // Mengarah ke halaman Kategori
            /> */}
            <SidebarItem
                icon={<MessageCircleMore size={20} />}
                text="Chat"
                to="/chat"  // Mengarah ke halaman Kategori
            />
            <hr />
            <SidebarItem
                icon={<Settings size={20} />}
                text="Pengaturan"
                to="/settings"  // Mengarah ke halaman Kategori
            />
        </Sidebar>
    );
}

export default SidebarPages;