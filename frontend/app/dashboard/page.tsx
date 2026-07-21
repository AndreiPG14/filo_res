"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Tag, Package, UtensilsCrossed, ShoppingCart, ClipboardList, Users, BarChart3, AlertTriangle } from "lucide-react";
import api from "@/lib/api";

const quickAccess = [
  { label: "Ventas (POS)", href: "/dashboard/pos", icon: ShoppingCart, color: "#5B5FEF", bg: "rgba(91,95,239,0.1)", desc: "Registrar venta" },
  { label: "Pedidos", href: "/dashboard/pedidos", icon: ClipboardList, color: "#10B981", bg: "rgba(16,185,129,0.1)", desc: "Ver pedidos" },
  { label: "Mesas", href: "/dashboard/mesas", icon: UtensilsCrossed, color: "#F59E0B", bg: "rgba(245,158,11,0.1)", desc: "Estado del salón" },
  { label: "Productos", href: "/dashboard/products", icon: Package, color: "#8B5CF6", bg: "rgba(139,92,246,0.1)", desc: "Gestionar stock" },
  { label: "Categorías", href: "/dashboard/categories", icon: Tag, color: "#EF4444", bg: "rgba(239,68,68,0.1)", desc: "Organizar menú" },
  { label: "Usuarios", href: "/dashboard/users", icon: Users, color: "#06B6D4", bg: "rgba(6,182,212,0.1)", desc: "Gestionar accesos" },
  { label: "Reportes", href: "/dashboard/reports", icon: BarChart3, color: "#10B981", bg: "rgba(16,185,129,0.1)", desc: "Ver ventas" },
];

interface Product { id: number; name: string; stock: number; alerts: number; }

export default function DashboardPage() {
  const [alertas, setAlertas] = useState<Product[]>([]);

  useEffect(() => {
    api.get("/products").then((res) => {
      const bajos = res.data.filter((p: Product) => p.stock <= p.alerts);
      setAlertas(bajos);
    }).catch(() => {});
  }, []);

  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Acceso rápido a todos los módulos del sistema</p>
      </div>

      {alertas.length > 0 && (
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            <p className="font-semibold text-amber-500">
              {alertas.length} producto{alertas.length > 1 ? 's' : ''} con stock bajo
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {alertas.map((p) => (
              <Link
                key={p.id}
                href="/dashboard/products"
                className="text-xs px-3 py-1.5 rounded-lg bg-amber-500/15 text-amber-400 hover:bg-amber-500/25 transition-colors"
              >
                {p.name} — <span className="font-bold">{p.stock} unid.</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {quickAccess.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="group rounded-xl p-5 flex flex-col gap-4 border bg-card hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
          >
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ background: item.bg }}
            >
              <item.icon className="h-5 w-5" style={{ color: item.color }} />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">{item.label}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
