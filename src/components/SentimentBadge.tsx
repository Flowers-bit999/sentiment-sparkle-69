import { ThumbsUp, ThumbsDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

type Sentiment = "positive" | "negative" | "neutral";

interface SentimentBadgeProps {
  sentiment: Sentiment;
  className?: string;
}

const sentimentConfig = {
  positive: {
    icon: ThumbsUp,
    label: "Positivo",
    bgColor: "bg-sentiment-positive-light",
    textColor: "text-sentiment-positive",
    iconColor: "text-sentiment-positive",
  },
  negative: {
    icon: ThumbsDown,
    label: "Negativo",
    bgColor: "bg-sentiment-negative-light",
    textColor: "text-sentiment-negative",
    iconColor: "text-sentiment-negative",
  },
  neutral: {
    icon: Minus,
    label: "Neutral",
    bgColor: "bg-sentiment-neutral-light",
    textColor: "text-sentiment-neutral",
    iconColor: "text-sentiment-neutral",
  },
};

export const SentimentBadge = ({ sentiment, className }: SentimentBadgeProps) => {
  const config = sentimentConfig[sentiment];
  const Icon = config.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-default",
        config.bgColor,
        config.textColor,
        className
      )}
    >
      <Icon className={cn("h-4 w-4 transition-transform duration-300 hover:rotate-12", config.iconColor)} />
      {config.label}
    </span>
  );
};
