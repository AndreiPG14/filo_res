"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { CrudTable } from "@/components/crud-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import api from "@/lib/api";

interface PedidoDetalle { id: number; nombre: string; cantidad: number; precio: number; }
interface Pedido { id: number; mesa?: { nombre: string }; estado: string; createdAt: string; detalles?: PedidoDetalle[]; }

const estadoColor: Record<string, "secondary" | "default" | "outline" | "destructive"> = {
  PENDIENTE: "secondary", LISTO: "default", ENTREGADO: "outline", CANCELADO: "destructive",
};

export default function PedidosPage() {
  const [data, setData] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Pedido | null>(null);

  const load = async () => {
    try { setLoading(true); const res = await api.get("/pedidos"); setData(res.data); }
    catch { toast.error("Error al cargar pedidos"); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const cambiarEstado = async (id: number, estado: string) => {
    try { await api.patch(`/pedidos/${id}`, { estado }); toast.success("Estado actualizado"); load(); }
    catch { toast.error("Error al actualizar"); }
  };

  return (
    <>
      <CrudTable
        title="Pedidos"
        loading={loading}
        data={data}
        columns={[
          { key: "id", label: "#" },
          { key: "mesa", label: "Mesa", render: (r) => r.mesa?.nombre || "—" },
          { key: "estado", label: "Estado", render: (r) => <Badge variant={estadoColor[r.estado] || "outline"}>{r.estado}</Badge> },
          { key: "createdAt", label: "Fecha", render: (r) => new Date(r.createdAt).toLocaleString("es-PE") },
          {
            key: "acciones", label: "Cambiar estado", render: (r) => (
              <div className="flex gap-1 flex-wrap">
                {["PENDIENTE", "LISTO", "ENTREGADO", "CANCELADO"].filter(e => e !== r.estado).map(e => (
                  <Button key={e} size="sm" variant="outline" className="text-xs h-7" onClick={() => cambiarEstado(r.id, e)}>{e}</Button>
                ))}
              </div>
            ),
          },
        ]}
        onEdit={(r) => setSelected(r)}
      />

      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Detalle Pedido #{selected?.id} — {selected?.mesa?.nombre}</DialogTitle></DialogHeader>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Producto</TableHead>
                <TableHead>Cant.</TableHead>
                <TableHead>Precio</TableHead>
                <TableHead>Subtotal</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {selected?.detalles?.map((d) => (
                <TableRow key={d.id}>
                  <TableCell>{d.nombre}</TableCell>
                  <TableCell>{d.cantidad}</TableCell>
                  <TableCell>S/ {Number(d.precio).toFixed(2)}</TableCell>
                  <TableCell>S/ {(d.cantidad * Number(d.precio)).toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </DialogContent>
      </Dialog>
    </>
  );
}
