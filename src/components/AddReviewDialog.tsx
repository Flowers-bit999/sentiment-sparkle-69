import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Star, MessageSquarePlus } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

const reviewSchema = z.object({
  content: z.string().trim().min(1, "El comentario es requerido").max(5000, "El comentario debe tener menos de 5000 caracteres"),
  rating: z.number().int().min(1, "Calificación mínima es 1").max(5, "Calificación máxima es 5")
});

interface AddReviewDialogProps {
  productId: string;
  onReviewAdded: () => void;
}

const AddReviewDialog = ({ productId, onReviewAdded }: AddReviewDialogProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [content, setContent] = useState("");

  const analyzeSentiment = (text: string, rating: number): string => {
    if (rating >= 4) return "positive";
    if (rating <= 2) return "negative";
    return "neutral";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error("Por favor selecciona una calificación");
      return;
    }

    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No autenticado");

      // Validate input
      const validatedData = reviewSchema.parse({ content, rating });

      const sentiment = analyzeSentiment(validatedData.content, validatedData.rating);

      const { error } = await supabase.from("reviews").insert({
        product_id: productId,
        user_id: user.id,
        content: validatedData.content,
        rating: validatedData.rating,
        sentiment,
      });

      if (error) throw error;

      toast.success("¡Reseña agregada exitosamente!");
      setContent("");
      setRating(0);
      setOpen(false);
      onReviewAdded();
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      } else if (error.message.includes("duplicate")) {
        toast.error("Ya has dejado una reseña para este producto");
      } else {
        toast.error(error.message || "Error al agregar reseña");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <MessageSquarePlus className="w-4 h-4" />
          Dejar Reseña
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Agregar Reseña</DialogTitle>
          <DialogDescription>
            Comparte tu opinión sobre este producto
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Calificación *</Label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-8 h-8 ${
                      star <= (hoveredRating || rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="content">Tu Opinión *</Label>
            <Textarea
              id="content"
              placeholder="Escribe tu experiencia con este producto..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              rows={4}
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Enviando..." : "Publicar Reseña"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddReviewDialog;