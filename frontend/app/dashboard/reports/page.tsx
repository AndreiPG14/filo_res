"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";

interface Sale { id: number; total: number; items: number; cash: number; change: number; status: string; createdAt: string; user?: { name: string }; }

export default function ReportsPage() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const load = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (from) params.from = from;
      if (to) params.to = to;
      const res = await api.get("/sales", { params });
      setSales(res.data);
    } catch { toast.error("Error al cargar ventas"); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const total = sales.reduce((sum, s) => sum + Number(s.total), 0);
  const totalItems = sales.reduce((sum, s) => sum + s.items, 0);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Reportes de Ventas</h1>

      <div className="flex gap-4 items-end flex-wrap">
        <div className="space-y-1">
          <Label>Desde</Label>
          <Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
        </div>
        <div className="space-y-1">
          <Label>Hasta</Label>
          <Input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
        </div>
        <Button onClick={load}>Filtrar</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm">Total vendido</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold">S/ {total.toFixed(2)}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm">N° de ventas</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold">{sales.length}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm">Total ítems</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold">{totalItems}</p></CardContent>
        </Card>
      </div>

      <div className="rounded-md border bg-background">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>Cajero</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Ítems</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Fecha</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">Cargando...</TableCell></TableRow>
            ) : sales.length === 0 ? (
              <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">Sin ventas</TableCell></TableRow>
            ) : sales.map((s) => (
              <TableRow key={s.id}>
                <TableCell>{s.id}</TableCell>
                <TableCell>{s.user?.name || "—"}</TableCell>
                <TableCell>S/ {Number(s.total).toFixed(2)}</TableCell>
                <TableCell>{s.items}</TableCell>
                <TableCell><Badge variant={s.status === "PAID" ? "secondary" : "destructive"}>{s.status}</Badge></TableCell>
                <TableCell>{new Date(s.createdAt).toLocaleString("es-PE")}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
