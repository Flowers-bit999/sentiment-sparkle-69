import { BarChart3, Search, TrendingUp, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProductCard } from "@/components/ProductCard";
import { ReviewCard } from "@/components/ReviewCard";
import heroImage from "@/assets/hero-bg.jpg";
import headphonesImg from "@/assets/product-headphones.jpg";
import smartwatchImg from "@/assets/product-smartwatch.jpg";
import laptopImg from "@/assets/product-laptop.jpg";
import speakerImg from "@/assets/product-speaker.jpg";

const products = [
  {
    id: "1",
    name: "Auriculares Inalámbricos Premium",
    image: headphonesImg,
    price: 199.99,
    rating: 4.6,
    totalReviews: 2453,
    sentimentScore: { positive: 78, neutral: 15, negative: 7 },
  },
  {
    id: "2",
    name: "SmartWatch Fitness Pro",
    image: smartwatchImg,
    price: 299.99,
    rating: 4.4,
    totalReviews: 1876,
    sentimentScore: { positive: 72, neutral: 20, negative: 8 },
  },
  {
    id: "3",
    name: "Laptop Ultra Performance",
    image: laptopImg,
    price: 1299.99,
    rating: 4.8,
    totalReviews: 3241,
    sentimentScore: { positive: 85, neutral: 10, negative: 5 },
  },
  {
    id: "4",
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

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
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
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-2xl mx-auto">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input 
                  placeholder="Buscar productos..." 
                  className="pl-10 h-12 bg-card border-white/20"
                />
              </div>
              <Button size="lg" className="h-12 px-8 bg-white text-primary hover:bg-white/90">
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
            <div className="flex flex-col items-center text-center p-6">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <BarChart3 className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-foreground">Análisis Avanzado</h3>
              <p className="text-muted-foreground">
                IA que procesa miles de reseñas para darte insights precisos
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-foreground">Tendencias en Tiempo Real</h3>
              <p className="text-muted-foreground">
                Monitorea cambios en la percepción de productos instantáneamente
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Shield className="h-8 w-8 text-primary" />
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
                Los productos más analizados de esta semana
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} {...product} />
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
              <ReviewCard key={index} {...review} />
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
          <Button size="lg" className="h-12 px-8 bg-white text-primary hover:bg-white/90">
            Comenzar Ahora
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
