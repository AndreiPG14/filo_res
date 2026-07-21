"use client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface Column<T> {
  key: keyof T | string;
  label: string;
  render?: (row: T) => React.ReactNode;
}

interface CrudTableProps<T> {
  title: string;
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  onAdd?: () => void;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  addLabel?: string;
}

export function CrudTable<T extends { id: number }>({
  title, columns, data, loading, onAdd, onEdit, onDelete, addLabel = "Agregar",
}: CrudTableProps<T>) {
  const hasActions = onEdit || onDelete;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight">{title}</h1>
          {!loading && (
            <p className="text-sm text-muted-foreground mt-0.5">
              {data.length} {data.length === 1 ? "registro" : "registros"}
            </p>
          )}
        </div>
        {onAdd && (
          <Button
            onClick={onAdd}
            size="sm"
            className="h-9 gap-1.5 font-medium"
            style={{ background: "#5B5FEF" }}
          >
            <Plus className="h-3.5 w-3.5" />
            {addLabel}
          </Button>
        )}
      </div>

      <div className="rounded-xl border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/40">
              {columns.map((col) => (
                <TableHead
                  key={String(col.key)}
                  className="text-xs font-semibold uppercase tracking-wide text-muted-foreground h-10"
                >
                  {col.label}
                </TableHead>
              ))}
              {hasActions && (
                <TableHead className="text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground h-10">
                  Acciones
                </TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {columns.map((col) => (
                    <TableCell key={String(col.key)} className="py-3">
                      <Skeleton className="h-4 w-3/4" />
                    </TableCell>
                  ))}
                  {hasActions && (
                    <TableCell className="py-3">
                      <Skeleton className="h-7 w-16 ml-auto" />
                    </TableCell>
                  )}
                </TableRow>
              ))
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (hasActions ? 1 : 0)}
                  className="text-center py-16 text-sm text-muted-foreground"
                >
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                      <Plus className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <span>No hay registros aún</span>
                    {onAdd && (
                      <Button variant="link" size="sm" onClick={onAdd} className="text-primary">
                        Agregar el primero
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              data.map((row) => (
                <TableRow key={row.id} className="hover:bg-muted/30 transition-colors">
                  {columns.map((col) => (
                    <TableCell key={String(col.key)} className="py-3 text-sm">
                      {col.render ? col.render(row) : String((row as any)[col.key] ?? "—")}
                    </TableCell>
                  ))}
                  {hasActions && (
                    <TableCell className="py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {onEdit && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:bg-primary/10 hover:text-primary"
                            onClick={() => onEdit(row)}
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                        )}
                        {onDelete && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
                            onClick={() => onDelete(row)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
