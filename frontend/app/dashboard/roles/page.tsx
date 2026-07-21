"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { CrudTable } from "@/components/crud-table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";

interface Role { id: number; name: string; }

export default function RolesPage() {
  const [data, setData] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Role | null>(null);
  const [form, setForm] = useState({ name: "" });

  const load = async () => {
    try { setLoading(true); const res = await api.get("/roles"); setData(res.data); }
    catch { toast.error("Error al cargar roles"); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => { setEditing(null); setForm({ name: "" }); setOpen(true); };
  const openEdit = (row: Role) => { setEditing(row); setForm({ name: row.name }); setOpen(true); };

  const handleSave = async () => {
    try {
      if (editing) await api.patch(`/roles/${editing.id}`, form);
      else await api.post("/roles", form);
      toast.success(editing ? "Rol actualizado" : "Rol creado");
      setOpen(false); load();
    } catch { toast.error("Error al guardar"); }
  };

  const handleDelete = async (row: Role) => {
    if (!confirm(`¿Eliminar rol "${row.name}"?`)) return;
    try { await api.delete(`/roles/${row.id}`); toast.success("Rol eliminado"); load(); }
    catch { toast.error("No se puede eliminar"); }
  };

  return (
    <>
      <CrudTable
        title="Roles"
        loading={loading}
        data={data}
        columns={[
          { key: "id", label: "#" },
          { key: "name", label: "Nombre" },
        ]}
        onAdd={openAdd} onEdit={openEdit} onDelete={handleDelete}
      />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing ? "Editar rol" : "Nuevo rol"}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1">
              <Label>Nombre</Label>
              <Input value={form.name} onChange={(e) => setForm({ name: e.target.value })} placeholder="Ej: Cajero" />
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
