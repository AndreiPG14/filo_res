"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { CrudTable } from "@/components/crud-table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";
import { ImageUpload } from "@/components/image-upload";

interface Category { id: number; name: string; image?: string; }

export default function CategoriesPage() {
  const [data, setData] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [form, setForm] = useState({ name: "", image: "" });

  const load = async () => {
    try {
      setLoading(true);
      const res = await api.get("/categories");
      setData(res.data);
    } catch { toast.error("Error al cargar categorías"); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => { setEditing(null); setForm({ name: "", image: "" }); setOpen(true); };
  const openEdit = (row: Category) => { setEditing(row); setForm({ name: row.name, image: row.image || "" }); setOpen(true); };

  const handleSave = async () => {
    try {
      if (editing) await api.patch(`/categories/${editing.id}`, form);
      else await api.post("/categories", form);
      toast.success(editing ? "Categoría actualizada" : "Categoría creada");
      setOpen(false); load();
    } catch { toast.error("Error al guardar"); }
  };

  const handleDelete = async (row: Category) => {
    if (!confirm(`¿Eliminar "${row.name}"?`)) return;
    try {
      await api.delete(`/categories/${row.id}`);
      toast.success("Categoría eliminada"); load();
    } catch { toast.error("No se puede eliminar"); }
  };

  return (
    <>
      <CrudTable
        title="Categorías"
        loading={loading}
        data={data}
        columns={[
          { key: "id", label: "#" },
          { key: "name", label: "Nombre" },
          { key: "image", label: "Imagen", render: (r) => r.image ? <img src={r.image} alt={r.name} className="h-10 w-10 object-cover rounded" /> : "—" },
        ]}
        onAdd={openAdd}
        onEdit={openEdit}
        onDelete={handleDelete}
      />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Editar categoría" : "Nueva categoría"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1">
              <Label>Nombre</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Ej: Bebidas" />
            </div>
            <div className="space-y-1">
              <Label>Imagen (opcional)</Label>
              <ImageUpload value={form.image} onChange={(url) => setForm({ ...form, image: url })} bucket="categoria" />
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
