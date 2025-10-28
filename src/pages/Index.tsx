import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BarChart3, Search, TrendingUp, Shield, LogOut, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProductCard } from "@/components/ProductCard";
import { ReviewCard } from "@/components/ReviewCard";
import AddProductDialog from "@/components/AddProductDialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import heroImage from "@/assets/hero-bg.jpg";
import headphonesImg from "@/assets/product-headphones.jpg";
import smartwatchImg from "@/assets/product-smartwatch.jpg";
import laptopImg from "@/assets/product-laptop.jpg";
import speakerImg from "@/assets/product-speaker.jpg";

const staticProducts = [
  {
    id: "static-1",
    name: "Auriculares Inalámbricos Premium",
    image: headphonesImg,
    price: 199.99,
    rating: 4.6,
    totalReviews: 2453,
    sentimentScore: { positive: 78, neutral: 15, negative: 7 },
  },
  {
    id: "static-2",
    name: "SmartWatch Fitness Pro",
    image: smartwatchImg,
    price: 299.99,
    rating: 4.4,
    totalReviews: 1876,
    sentimentScore: { positive: 72, neutral: 20, negative: 8 },
  },
  {
    id: "static-3",
    name: "Laptop Ultra Performance",
    image: laptopImg,
    price: 1299.99,
    rating: 4.8,
    totalReviews: 3241,
    sentimentScore: { positive: 85, neutral: 10, negative: 5 },
  },
  {
    id: "static-4",
    name: "Altavoz Bluetooth Portátil",
    image: speakerImg,
    price: 89.99,
    rating: 4.5,
    totalReviews: 1532,
    sentimentScore: { positive: 75, neutral: 18, negative: 7 },
  },
];

const featuredReviews = [
  {
    author: "María González",
    rating: 5,
    date: "15 Ene 2025",
    comment: "Excelente producto, superó mis expectativas. La calidad de sonido es impresionante y la batería dura todo el día. Totalmente recomendado para profesionales.",
    sentiment: "positive" as const,
    verified: true,
  },
  {
    author: "Carlos Ruiz",
    rating: 4,
    date: "12 Ene 2025",
    comment: "Buen producto en general. La entrega fue rápida y el empaque excelente. Solo le falta un poco más de graves en el sonido, pero por el precio está muy bien.",
    sentiment: "neutral" as const,
    verified: true,
  },
  {
    author: "Ana Martínez",
    rating: 2,
    date: "8 Ene 2025",
    comment: "Decepcionante. Esperaba más por el precio. La conexión Bluetooth falla constantemente y el material se siente frágil. No lo recomendaría.",
    sentiment: "negative" as const,
    verified: false,
  },
];

interface DbProduct {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  category: string | null;
  created_at: string;
}

const Index = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [dbProducts, setDbProducts] = useState<DbProduct[]>([]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setDbProducts(data);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success("Sesión cerrada");
  };

  const handleProductClick = (productId: string) => {
    if (!productId.startsWith("static-")) {
      navigate(`/product/${productId}`);
    }
  };

  const allProducts = [
    ...dbProducts.map((p) => ({
      id: p.id,
      name: p.name,
      image: p.image_url || "/placeholder.svg",
      price: 0,
      rating: 0,
      totalReviews: 0,
      sentimentScore: { positive: 0, neutral: 0, negative: 0 },
      isClickable: true,
    })),
    ...staticProducts.map((p) => ({ ...p, isClickable: false })),
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-foreground">Análisis de Sentimientos</h1>
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <AddProductDialog onProductAdded={fetchProducts} />
                <Button onClick={handleSignOut} variant="outline" className="gap-2">
                  <LogOut className="w-4 h-4" />
                  Cerrar Sesión
                </Button>
              </>
            ) : (
              <Button onClick={() => navigate("/auth")} className="gap-2">
                <LogIn className="w-4 h-4" />
                Iniciar Sesión
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-gradient-hero opacity-90"
          style={{
            backgroundImage: `url(${heroImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundBlendMode: 'multiply',
          }}
        />
        <div className="relative container mx-auto px-4 py-24 lg:py-32">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 animate-fade-in">
              Análisis de Sentimientos en Reseñas de Productos
            </h1>
            <p className="text-xl lg:text-2xl mb-8 text-white/90">
              Descubre qué piensan realmente los usuarios sobre los productos con análisis impulsado por IA
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '200ms' }}>
              <div className="relative flex-1 w-full group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground transition-transform duration-300 group-focus-within:scale-110" />
                <Input 
                  placeholder="Buscar productos..." 
                  className="pl-10 h-12 bg-card border-white/20 transition-all duration-300 focus:ring-2 focus:ring-white/30"
                />
              </div>
              <Button size="lg" className="h-12 px-8 bg-white text-primary hover:bg-white/90 transition-all duration-300 hover:scale-105 hover:shadow-xl">
                Buscar
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-card border-y border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6 animate-fade-in group cursor-pointer hover:-translate-y-2 transition-all duration-500">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-all duration-500 group-hover:shadow-lg">
                <BarChart3 className="h-8 w-8 text-primary group-hover:scale-110 transition-transform duration-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-foreground">Análisis Avanzado</h3>
              <p className="text-muted-foreground">
                IA que procesa miles de reseñas para darte insights precisos
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6 animate-fade-in group cursor-pointer hover:-translate-y-2 transition-all duration-500" style={{ animationDelay: '150ms' }}>
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-all duration-500 group-hover:shadow-lg">
                <TrendingUp className="h-8 w-8 text-primary group-hover:scale-110 transition-transform duration-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-foreground">Tendencias en Tiempo Real</h3>
              <p className="text-muted-foreground">
                Monitorea cambios en la percepción de productos instantáneamente
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6 animate-fade-in group cursor-pointer hover:-translate-y-2 transition-all duration-500" style={{ animationDelay: '300ms' }}>
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-all duration-500 group-hover:shadow-lg">
                <Shield className="h-8 w-8 text-primary group-hover:scale-110 transition-transform duration-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-foreground">Reseñas Verificadas</h3>
              <p className="text-muted-foreground">
                Solo analizamos opiniones de compradores verificados
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">
                Productos Destacados
              </h2>
              <p className="text-muted-foreground">
                {dbProducts.length > 0 
                  ? "Productos agregados por la comunidad" 
                  : "Los productos más analizados de esta semana"}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {allProducts.map((product, index) => (
              <div 
                key={product.id} 
                style={{ animationDelay: `${index * 100}ms` }}
                onClick={() => handleProductClick(product.id)}
                className={product.isClickable ? "cursor-pointer" : ""}
              >
                <ProductCard {...product} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Reseñas Recientes
          </h2>
          <p className="text-muted-foreground mb-8">
            Análisis de sentimiento en tiempo real
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {featuredReviews.map((review, index) => (
              <div key={index} style={{ animationDelay: `${index * 150}ms` }}>
                <ReviewCard {...review} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-hero">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            ¿Listo para tomar mejores decisiones de compra?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Únete a miles de usuarios que confían en nuestro análisis de sentimientos
          </p>
          <Button 
            size="lg" 
            className="h-12 px-8 bg-white text-primary hover:bg-white/90"
            onClick={() => navigate(user ? "/" : "/auth")}
          >
            {user ? "Explorar Productos" : "Comenzar Ahora"}
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-card border-t border-border">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">
            © 2025 Análisis de Sentimientos. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;