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
import { ImageUpload } from "@/components/image-upload";

interface Category { id: number; name: string; }
interface Product { id: number; name: string; price: number; stock: number; alerts: number; image?: string; categoryId: number; category?: Category; }

const emptyForm = { name: "", price: "0", stock: "0", alerts: "0", image: "", categoryId: "" };

export default function ProductsPage() {
  const [data, setData] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState(emptyForm);

  const load = async () => {
    try {
      setLoading(true);
      const [prod, cats] = await Promise.all([api.get("/products"), api.get("/categories")]);
      setData(prod.data); setCategories(cats.data);
    } catch { toast.error("Error al cargar"); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => { setEditing(null); setForm(emptyForm); setOpen(true); };
  const openEdit = (row: Product) => {
    setEditing(row);
    setForm({ name: row.name, price: String(row.price), stock: String(row.stock), alerts: String(row.alerts), image: row.image || "", categoryId: String(row.categoryId) });
    setOpen(true);
  };

  const handleSave = async () => {
    try {
      const payload = { ...form, price: Number(form.price), stock: Number(form.stock), alerts: Number(form.alerts), categoryId: Number(form.categoryId) };
      if (editing) await api.patch(`/products/${editing.id}`, payload);
      else await api.post("/products", payload);
      toast.success(editing ? "Producto actualizado" : "Producto creado");
      setOpen(false); load();
    } catch { toast.error("Error al guardar"); }
  };

  const handleDelete = async (row: Product) => {
    if (!confirm(`¿Eliminar "${row.name}"?`)) return;
    try { await api.delete(`/products/${row.id}`); toast.success("Eliminado"); load(); }
    catch (e: any) { toast.error(e?.response?.data?.message || "No se puede eliminar — tiene ventas registradas"); }
  };

  return (
    <>
      <CrudTable
        title="Productos"
        loading={loading}
        data={data}
        columns={[
          { key: "name", label: "Nombre" },
          { key: "category", label: "Categoría", render: (r) => r.category?.name || "—" },
          { key: "price", label: "Precio", render: (r) => `S/ ${Number(r.price).toFixed(2)}` },
          { key: "stock", label: "Stock", render: (r) => <Badge variant={r.stock <= r.alerts ? "destructive" : "secondary"}>{r.stock}</Badge> },
        ]}
        onAdd={openAdd} onEdit={openEdit} onDelete={handleDelete}
      />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{editing ? "Editar producto" : "Nuevo producto"}</DialogTitle></DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-2">
            <div className="col-span-2 space-y-1">
              <Label>Nombre</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="space-y-1">
              <Label>Categoría</Label>
              <Select value={form.categoryId} onValueChange={(v) => setForm({ ...form, categoryId: v as string })}>
                <SelectTrigger><SelectValue placeholder="Seleccionar" /></SelectTrigger>
                <SelectContent>{categories.map((c) => <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>Precio</Label>
              <Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
            </div>
            <div className="space-y-1">
              <Label>Stock</Label>
              <Input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
            </div>
            <div className="space-y-1">
              <Label>Alerta stock</Label>
              <Input type="number" value={form.alerts} onChange={(e) => setForm({ ...form, alerts: e.target.value })} />
            </div>
            <div className="col-span-2 space-y-1">
              <Label>Imagen (opcional)</Label>
              <ImageUpload value={form.image} onChange={(url) => setForm({ ...form, image: url })} bucket="productos" />
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
