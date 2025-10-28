import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Star } from "lucide-react";
import { ReviewCard } from "@/components/ReviewCard";
import AddReviewDialog from "@/components/AddReviewDialog";
import { SentimentBadge } from "@/components/SentimentBadge";
import { toast } from "sonner";

interface Product {
  id: string;
  name: string;
  description: string;
  image_url: string;
  category: string;
  created_at: string;
  profiles: {
    display_name: string;
  };
}

interface Review {
  id: string;
  content: string;
  rating: number;
  sentiment: string;
  created_at: string;
  profiles: {
    display_name: string;
    avatar_url: string;
  };
}

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });
  }, []);

  const fetchProduct = async () => {
    if (!id) return;

    try {
      const { data, error } = await supabase
        .from("products")
        .select("*, profiles(display_name)")
        .eq("id", id)
        .single();

      if (error) throw error;
      setProduct(data);
    } catch (error: any) {
      toast.error("Error al cargar el producto");
      navigate("/");
    }
  };

  const fetchReviews = async () => {
    if (!id) return;

    try {
      const { data, error } = await supabase
        .from("reviews")
        .select("*, profiles(display_name, avatar_url)")
        .eq("product_id", id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setReviews(data || []);
    } catch (error: any) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
    fetchReviews();
  }, [id]);

  const sentimentCounts = reviews.reduce(
    (acc, review) => {
      acc[review.sentiment]++;
      return acc;
    },
    { positive: 0, negative: 0, neutral: 0 }
  );

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Cargando...</p>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/5 to-background">
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-6 gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver
        </Button>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="animate-scale-in">
            <img
              src={product.image_url || "/placeholder.svg"}
              alt={product.name}
              className="w-full h-96 object-cover rounded-lg shadow-elegant"
            />
          </div>

          <div className="space-y-6 animate-slide-up">
            <div>
              <h1 className="text-4xl font-bold mb-2">{product.name}</h1>
              {product.category && (
                <p className="text-sm text-muted-foreground">
                  Categoría: {product.category}
                </p>
              )}
              <p className="text-sm text-muted-foreground">
                Agregado por: {product.profiles?.display_name || "Usuario"}
              </p>
            </div>

            {product.description && (
              <p className="text-lg text-muted-foreground">{product.description}</p>
            )}

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold">
                  {averageRating.toFixed(1)}
                </span>
                <span className="text-sm text-muted-foreground">
                  ({reviews.length} reseñas)
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              <SentimentBadge sentiment="positive" count={sentimentCounts.positive} />
              <SentimentBadge sentiment="neutral" count={sentimentCounts.neutral} />
              <SentimentBadge sentiment="negative" count={sentimentCounts.negative} />
            </div>

            {user && (
              <AddReviewDialog
                productId={product.id}
                onReviewAdded={fetchReviews}
              />
            )}
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Reseñas de Usuarios</h2>
          {reviews.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">
                  Aún no hay reseñas. ¡Sé el primero en opinar!
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {reviews.map((review, index) => (
                <div
                  key={review.id}
                  className="animate-scale-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <ReviewCard
                    author={review.profiles?.display_name || "Usuario"}
                    comment={review.content}
                    rating={review.rating}
                    sentiment={review.sentiment as "positive" | "negative" | "neutral"}
                    date={new Date(review.created_at).toLocaleDateString()}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;