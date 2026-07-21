"use client";
import { useEffect } from "react";
import { toast } from "sonner";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import api from "@/lib/api";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (sessionStorage.getItem("stock_alerta_mostrada")) return;
    api.get("/products").then((res) => {
      const bajos = res.data.filter((p: { stock: number; alerts: number; name: string }) => p.stock <= p.alerts);
      if (bajos.length > 0) {
        toast.warning(`${bajos.length} producto${bajos.length > 1 ? 's' : ''} con stock bajo`, {
          description: bajos.map((p: { name: string; stock: number }) => `${p.name}: ${p.stock} unid.`).join(' · '),
          duration: 10000,
        });
        sessionStorage.setItem("stock_alerta_mostrada", "1");
      }
    }).catch(() => {});
  }, []);

  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="flex-1 flex flex-col min-h-screen">
        <header className="h-14 border-b flex items-center px-5 gap-4 bg-card sticky top-0 z-10">
          <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
          <div className="h-4 w-px bg-border" />
          <span className="text-sm text-muted-foreground hidden sm:block">Filo POS</span>
          <div className="ml-auto flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-xs text-muted-foreground">En línea</span>
            </div>
          </div>
        </header>
        <main className="flex-1 p-6 bg-background">{children}</main>
      </div>
    </SidebarProvider>
  );
}
