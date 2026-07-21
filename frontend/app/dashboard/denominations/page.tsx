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

interface Denomination { id: number; type: string; value: string; image?: string; }

export default function DenominationsPage() {
  const [data, setData] = useState<Denomination[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Denomination | null>(null);
  const [form, setForm] = useState({ type: "BILLETE", value: "", image: "" });

  const load = async () => {
    try { setLoading(true); const res = await api.get("/denominations"); setData(res.data); }
    catch { toast.error("Error al cargar"); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => { setEditing(null); setForm({ type: "BILLETE", value: "", image: "" }); setOpen(true); };
  const openEdit = (row: Denomination) => { setEditing(row); setForm({ type: row.type, value: row.value, image: row.image || "" }); setOpen(true); };

  const handleSave = async () => {
    try {
      if (editing) await api.patch(`/denominations/${editing.id}`, form);
      else await api.post("/denominations", form);
      toast.success(editing ? "Actualizado" : "Creado");
      setOpen(false); load();
    } catch { toast.error("Error al guardar"); }
  };

  const handleDelete = async (row: Denomination) => {
    if (!confirm(`¿Eliminar S/ ${row.value}?`)) return;
    try { await api.delete(`/denominations/${row.id}`); toast.success("Eliminado"); load(); }
    catch { toast.error("No se puede eliminar"); }
  };

  const typeColor: Record<string, "default" | "secondary" | "outline"> = { BILLETE: "default", MONEDA: "secondary", OTRO: "outline" };

  return (
    <>
      <CrudTable
        title="Denominaciones"
        loading={loading}
        data={data}
        columns={[
          { key: "type", label: "Tipo", render: (r) => <Badge variant={typeColor[r.type] || "outline"}>{r.type}</Badge> },
          { key: "value", label: "Valor", render: (r) => `S/ ${r.value}` },
        ]}
        onAdd={openAdd} onEdit={openEdit} onDelete={handleDelete}
      />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing ? "Editar denominación" : "Nueva denominación"}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1">
              <Label>Tipo</Label>
              <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="BILLETE">Billete</SelectItem>
                  <SelectItem value="MONEDA">Moneda</SelectItem>
                  <SelectItem value="OTRO">Otro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>Valor</Label>
              <Input value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} placeholder="Ej: 10.00" />
            </div>
            <div className="space-y-1">
              <Label>URL imagen (opcional)</Label>
              <Input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
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
