"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Trash2, Plus, Minus, ShoppingCart } from "lucide-react";
import api from "@/lib/api";

interface Product { id: number; name: string; price: number; stock: number; category?: { name: string }; }
interface CartItem extends Product { qty: number; }

export default function PosPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cash, setCash] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/products").then((r) => setProducts(r.data)).catch(() => toast.error("Error al cargar productos")).finally(() => setLoading(false));
  }, []);

  const addToCart = (p: Product) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === p.id);
      if (existing) return prev.map((i) => i.id === p.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...p, qty: 1 }];
    });
  };

  const updateQty = (id: number, delta: number) => {
    setCart((prev) => prev.map((i) => i.id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i));
  };

  const removeItem = (id: number) => setCart((prev) => prev.filter((i) => i.id !== id));

  const total = cart.reduce((sum, i) => sum + Number(i.price) * i.qty, 0);
  const change = Number(cash) - total;
  const filtered = products.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));

  const handleSale = async () => {
    if (cart.length === 0) { toast.error("Agrega productos al carrito"); return; }
    if (!cash || Number(cash) < total) { toast.error("Efectivo insuficiente"); return; }
    try {
      await api.post("/sales", {
        total, items: cart.reduce((s, i) => s + i.qty, 0),
        cash: Number(cash), change,
        details: cart.map((i) => ({ productId: i.id, price: Number(i.price), quantity: i.qty })),
      });
      toast.success("Venta registrada");
      setCart([]); setCash("");
    } catch { toast.error("Error al registrar venta"); }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
      {/* Productos */}
      <div className="lg:col-span-2 space-y-4">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold">Punto de Venta</h1>
          <Input placeholder="Buscar producto..." value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-xs" />
        </div>
        {loading ? <p className="text-muted-foreground">Cargando productos...</p> : (
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
            {filtered.map((p) => (
              <Card key={p.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => addToCart(p)}>
                <CardHeader className="pb-1 pt-3 px-3">
                  <Badge variant="outline" className="text-xs w-fit">{p.category?.name}</Badge>
                </CardHeader>
                <CardContent className="px-3 pb-3">
                  <p className="font-medium text-sm leading-tight">{p.name}</p>
                  <p className="text-primary font-bold mt-1">S/ {Number(p.price).toFixed(2)}</p>
                  <p className="text-xs text-muted-foreground">Stock: {p.stock}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Carrito */}
      <div className="space-y-4">
        <Card className="h-fit">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <ShoppingCart className="h-4 w-4" /> Carrito ({cart.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {cart.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">Sin productos</p>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="flex items-center gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.name}</p>
                    <p className="text-xs text-muted-foreground">S/ {(Number(item.price) * item.qty).toFixed(2)}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button size="icon" variant="outline" className="h-6 w-6" onClick={() => updateQty(item.id, -1)}><Minus className="h-3 w-3" /></Button>
                    <span className="text-sm w-6 text-center">{item.qty}</span>
                    <Button size="icon" variant="outline" className="h-6 w-6" onClick={() => updateQty(item.id, 1)}><Plus className="h-3 w-3" /></Button>
                    <Button size="icon" variant="ghost" className="h-6 w-6 text-destructive" onClick={() => removeItem(item.id)}><Trash2 className="h-3 w-3" /></Button>
                  </div>
                </div>
              ))
            )}

            <Separator />
            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span>S/ {total.toFixed(2)}</span>
            </div>
            <div className="space-y-1">
              <label className="text-sm">Efectivo</label>
              <Input type="number" placeholder="0.00" value={cash} onChange={(e) => setCash(e.target.value)} />
            </div>
            {cash && Number(cash) >= total && (
              <div className="flex justify-between text-sm text-green-600 font-medium">
                <span>Vuelto</span>
                <span>S/ {change.toFixed(2)}</span>
              </div>
            )}
            <Button className="w-full" onClick={handleSale} disabled={cart.length === 0}>
              Cobrar S/ {total.toFixed(2)}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
