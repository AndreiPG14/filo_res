"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { CrudTable } from "@/components/crud-table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import api from "@/lib/api";

interface Mesa { id: number; nombre: string; estado: "libre" | "ocupada"; }

export default function MesasPage() {
  const [data, setData] = useState<Mesa[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Mesa | null>(null);
  const [form, setForm] = useState({ nombre: "", estado: "libre" });

  const load = async () => {
    try { setLoading(true); const res = await api.get("/mesas"); setData(res.data); }
    catch { toast.error("Error al cargar mesas"); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => { setEditing(null); setForm({ nombre: "", estado: "libre" }); setOpen(true); };
  const openEdit = (row: Mesa) => { setEditing(row); setForm({ nombre: row.nombre, estado: row.estado }); setOpen(true); };

  const handleSave = async () => {
    try {
      if (editing) await api.patch(`/mesas/${editing.id}`, form);
      else await api.post("/mesas", form);
      toast.success(editing ? "Mesa actualizada" : "Mesa creada");
      setOpen(false); load();
    } catch { toast.error("Error al guardar"); }
  };

  const handleDelete = async (row: Mesa) => {
    if (!confirm(`¿Eliminar mesa "${row.nombre}"?`)) return;
    try { await api.delete(`/mesas/${row.id}`); toast.success("Mesa eliminada"); load(); }
    catch { toast.error("No se puede eliminar"); }
  };

  return (
    <>
      <CrudTable
        title="Mesas"
        loading={loading}
        data={data}
        columns={[
          { key: "nombre", label: "Mesa" },
          { key: "estado", label: "Estado", render: (r) => <Badge variant={r.estado === "libre" ? "secondary" : "destructive"}>{r.estado.toUpperCase()}</Badge> },
        ]}
        onAdd={openAdd} onEdit={openEdit} onDelete={handleDelete}
      />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing ? "Editar mesa" : "Nueva mesa"}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1">
              <Label>Nombre</Label>
              <Input value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} placeholder="Ej: Mesa 1" />
            </div>
            <div className="space-y-1">
              <Label>Estado</Label>
              <Select value={form.estado} onValueChange={(v) => setForm({ ...form, estado: v as string })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="libre">Libre</SelectItem>
                  <SelectItem value="ocupada">Ocupada</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button onClick={handleSave}>Guardar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
