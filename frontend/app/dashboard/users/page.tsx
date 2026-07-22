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

interface User { id: number; name: string; email: string; phone?: string; profile: string; status: string; }

const emptyForm = { name: "", email: "", phone: "", password: "", profile: "EMPLOYEE", status: "ACTIVE" };

export default function UsersPage() {
  const [data, setData] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);
  const [form, setForm] = useState(emptyForm);

  const load = async () => {
    try { setLoading(true); const res = await api.get("/users"); setData(res.data); }
    catch { toast.error("Error al cargar usuarios"); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => { setEditing(null); setForm(emptyForm); setOpen(true); };
  const openEdit = (row: User) => {
    setEditing(row);
    setForm({ name: row.name, email: row.email, phone: row.phone || "", password: "", profile: row.profile, status: row.status });
    setOpen(true);
  };

  const handleSave = async () => {
    try {
      const payload: any = { name: form.name, email: form.email, phone: form.phone, profile: form.profile, status: form.status };
      if (form.password) payload.password = form.password;
      if (editing) await api.patch(`/users/${editing.id}`, payload);
      else await api.post("/users", { ...payload, password: form.password });
      toast.success(editing ? "Usuario actualizado" : "Usuario creado");
      setOpen(false); load();
    } catch { toast.error("Error al guardar"); }
  };

  const handleDelete = async (row: User) => {
    if (!confirm(`¿Eliminar usuario "${row.name}"?`)) return;
    try { await api.delete(`/users/${row.id}`); toast.success("Usuario eliminado"); load(); }
    catch { toast.error("No se puede eliminar"); }
  };

  return (
    <>
      <CrudTable
        title="Usuarios"
        loading={loading}
        data={data}
        columns={[
          { key: "name", label: "Nombre" },
          { key: "email", label: "Email" },
          { key: "profile", label: "Perfil", render: (r) => <Badge variant="outline">{r.profile === "ADMIN" ? "Administrador" : "Mesero"}</Badge> },
          { key: "status", label: "Estado", render: (r) => <Badge variant={r.status === "ACTIVE" ? "secondary" : "destructive"}>{r.status}</Badge> },
        ]}
        onAdd={openAdd} onEdit={openEdit} onDelete={handleDelete}
      />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{editing ? "Editar usuario" : "Nuevo usuario"}</DialogTitle></DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-2">
            <div className="col-span-2 space-y-1">
              <Label>Nombre</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="space-y-1">
              <Label>Email</Label>
              <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div className="space-y-1">
              <Label>Teléfono</Label>
              <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div className="space-y-1">
              <Label>{editing ? "Nueva contraseña (opcional)" : "Contraseña"}</Label>
              <Input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            </div>
            <div className="space-y-1">
              <Label>Perfil</Label>
              <Select value={form.profile} onValueChange={(v) => setForm({ ...form, profile: v as string })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="ADMIN">Administrador</SelectItem>
                  <SelectItem value="EMPLOYEE">Mesero</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>Estado</Label>
              <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as string })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIVE">Activo</SelectItem>
                  <SelectItem value="LOCKED">Bloqueado</SelectItem>
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
