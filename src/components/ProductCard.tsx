import { Star, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface ProductCardProps {
  id: string;
  name: string;
  image: string;
  price: number;
  rating: number;
  totalReviews: number;
  sentimentScore: {
    positive: number;
    negative: number;
    neutral: number;
  };
}

export const ProductCard = ({
  name,
  image,
  price,
  rating,
  totalReviews,
  sentimentScore,
}: ProductCardProps) => {
  return (
    <Card className="shadow-card hover:shadow-hover transition-smooth overflow-hidden group cursor-pointer">
      <div className="aspect-square overflow-hidden bg-gradient-card">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-smooth"
        />
      </div>
      <CardContent className="p-6">
        <h3 className="font-semibold text-lg text-foreground mb-2 line-clamp-2">{name}</h3>
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-primary text-primary" />
            <span className="font-medium text-foreground">{rating.toFixed(1)}</span>
          </div>
          <span className="text-sm text-muted-foreground">
            ({totalReviews} reseñas)
          </span>
        </div>
        <p className="text-2xl font-bold text-primary mb-4">${price.toFixed(2)}</p>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Análisis de sentimiento</span>
            <TrendingUp className="h-4 w-4 text-sentiment-positive" />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-sentiment-positive">Positivo</span>
              <span className="font-medium text-sentiment-positive">{sentimentScore.positive}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
              <div 
                className="h-full bg-sentiment-positive transition-all"
                style={{ width: `${sentimentScore.positive}%` }}
              />
            </div>
            
            <div className="flex items-center justify-between text-xs">
              <span className="text-sentiment-neutral">Neutral</span>
              <span className="font-medium text-sentiment-neutral">{sentimentScore.neutral}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
              <div 
                className="h-full bg-sentiment-neutral transition-all"
                style={{ width: `${sentimentScore.neutral}%` }}
              />
            </div>
            
            <div className="flex items-center justify-between text-xs">
              <span className="text-sentiment-negative">Negativo</span>
              <span className="font-medium text-sentiment-negative">{sentimentScore.negative}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
              <div 
                className="h-full bg-sentiment-negative transition-all"
                style={{ width: `${sentimentScore.negative}%` }}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
