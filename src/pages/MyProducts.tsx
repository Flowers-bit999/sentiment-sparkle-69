import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import EditProductDialog from "@/components/EditProductDialog";

interface Product {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  category: string | null;
  created_at: string;
}

const MyProducts = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      toast.error("Debes iniciar sesión");
      navigate("/auth");
      return;
    }
    setUser(session.user);
    fetchMyProducts(session.user.id);
  };

  const fetchMyProducts = async (userId: string) => {
    setLoading(true);
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Error al cargar productos");
    } else {
      setProducts(data || []);
    }
    setLoading(false);
  };

  const handleDelete = async (productId: string) => {
    if (!confirm("¿Estás seguro de eliminar este producto?")) return;

    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", productId);

    if (error) {
      toast.error("Error al eliminar producto");
    } else {
      toast.success("Producto eliminado");
      setProducts(products.filter(p => p.id !== productId));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <Package className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold text-foreground">Mis Productos</h1>
              <p className="text-muted-foreground">Gestiona los productos que has publicado</p>
            </div>
          </div>

          {products.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">
                  Aún no has publicado ningún producto
                </p>
                <Button onClick={() => navigate("/")}>
                  Ir al inicio
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  {product.image_url && (
                    <div className="aspect-video w-full overflow-hidden bg-muted">
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="line-clamp-1">{product.name}</CardTitle>
                    {product.category && (
                      <CardDescription>{product.category}</CardDescription>
                    )}
                  </CardHeader>
                  <CardContent>
                    {product.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                        {product.description}
                      </p>
                    )}
                    <div className="flex gap-2">
                      <EditProductDialog
                        product={product}
                        onProductUpdated={() => user && fetchMyProducts(user.id)}
                      />
                      <Button
                        variant="outline"
                        onClick={() => navigate(`/product/${product.id}`)}
                        className="flex-1"
                      >
                        Ver Detalles
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => handleDelete(product.id)}
                      >
                        Eliminar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default MyProducts;
