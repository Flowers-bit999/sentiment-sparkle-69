import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Pencil } from "lucide-react";

interface Product {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  category: string | null;
}

interface EditProductDialogProps {
  product: Product;
  onProductUpdated: () => void;
}

const EditProductDialog = ({ product, onProductUpdated }: EditProductDialogProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: product.name,
    description: product.description || "",
    category: product.category || "",
    image_url: product.image_url || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase
      .from("products")
      .update({
        name: formData.name,
        description: formData.description,
        category: formData.category,
        image_url: formData.image_url,
      })
      .eq("id", product.id);

    if (error) {
      toast.error("Error al actualizar producto");
    } else {
      toast.success("Producto actualizado correctamente");
      onProductUpdated();
      setOpen(false);
    }
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2 flex-1">
          <Pencil className="w-4 h-4" />
          Editar
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Editar Producto</DialogTitle>
          <DialogDescription>
            Modifica la información de tu producto
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre del Producto</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Categoría</Label>
            <Input
              id="category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="image_url">URL de la Imagen</Label>
            <Input
              id="image_url"
              type="url"
              value={formData.image_url}
              onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
            />
          </div>
          <div className="flex gap-2">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? "Guardando..." : "Guardar Cambios"}
            </Button>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditProductDialog;
