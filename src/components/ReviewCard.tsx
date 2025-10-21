import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { SentimentBadge } from "./SentimentBadge";

interface ReviewCardProps {
  author: string;
  rating: number;
  date: string;
  comment: string;
  sentiment: "positive" | "negative" | "neutral";
  verified?: boolean;
}

export const ReviewCard = ({
  author,
  rating,
  date,
  comment,
  sentiment,
  verified = false,
}: ReviewCardProps) => {
  return (
    <Card className="shadow-card hover:shadow-hover transition-smooth">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h4 className="font-semibold text-foreground">{author}</h4>
              {verified && (
                <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                  Verificado
                </span>
              )}
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "h-4 w-4",
                      i < rating ? "fill-primary text-primary" : "fill-muted text-muted"
                    )}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">{date}</span>
            </div>
          </div>
          <SentimentBadge sentiment={sentiment} />
        </div>
        <p className="text-foreground leading-relaxed">{comment}</p>
      </CardContent>
    </Card>
  );
};

function cn(...classes: (string | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
