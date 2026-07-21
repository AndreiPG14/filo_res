"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Tag, Package, UtensilsCrossed,
  ClipboardList, ShoppingCart, Users, BarChart3, LogOut,
} from "lucide-react";
import {
  Sidebar, SidebarContent, SidebarFooter, SidebarGroup,
  SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuItem,
} from "@/components/ui/sidebar";

const navGroups = [
  {
    label: "Principal",
    items: [
      { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { label: "Ventas (POS)", href: "/dashboard/pos", icon: ShoppingCart },
      { label: "Pedidos", href: "/dashboard/pedidos", icon: ClipboardList },
      { label: "Mesas", href: "/dashboard/mesas", icon: UtensilsCrossed },
    ],
  },
  {
    label: "Inventario",
    items: [
      { label: "Productos", href: "/dashboard/products", icon: Package },
      { label: "Categorías", href: "/dashboard/categories", icon: Tag },
    ],
  },
  {
    label: "Administración",
    items: [
      { label: "Usuarios", href: "/dashboard/users", icon: Users },
      { label: "Reportes", href: "/dashboard/reports", icon: BarChart3 },
    ],
  },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar>
      {/* Header */}
      <SidebarHeader className="px-4 py-5">
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: "#5B5FEF" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
          </div>
          <div>
            <p className="text-sm font-bold text-white leading-none">Filo POS</p>
            <p className="text-xs mt-0.5" style={{ color: "#4A4D6A" }}>Panel de control</p>
          </div>
        </div>
      </SidebarHeader>

      {/* Nav */}
      <SidebarContent className="px-2">
        {navGroups.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel
              className="text-xs font-semibold uppercase tracking-widest px-3 mb-1"
              style={{ color: "#4A4D6A" }}
            >
              {group.label}
            </SidebarGroupLabel>
            <SidebarMenu>
              {group.items.map((item) => {
                const active = pathname === item.href;
                return (
                  <SidebarMenuItem key={item.href}>
                    <Link
                      href={item.href}
                      className="flex items-center gap-3 rounded-lg h-9 px-3 text-sm font-medium transition-colors w-full"
                      style={active
                        ? { background: "#5B5FEF", color: "#FFFFFF" }
                        : { color: "#9497B8" }
                      }
                    >
                      <item.icon className="h-4 w-4 flex-shrink-0" />
                      <span>{item.label}</span>
                      {active && (
                        <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white/60" />
                      )}
                    </Link>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroup>
        ))}
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="p-3">
        <button
          onClick={() => { localStorage.removeItem("token"); window.location.href = "/login"; }}
          className="flex items-center gap-3 w-full rounded-lg px-3 h-9 text-sm font-medium transition-colors"
          style={{ color: "#4A4D6A" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#EF4444"; (e.currentTarget as HTMLElement).style.background = "rgba(239,68,68,0.08)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "#4A4D6A"; (e.currentTarget as HTMLElement).style.background = "transparent"; }}
        >
          <LogOut className="h-4 w-4" />
          Cerrar sesión
        </button>
      </SidebarFooter>
    </Sidebar>
  );
}
