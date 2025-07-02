import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown, Minus } from "lucide-react";

interface FeedbackRatingProps {
  onRate: (rating: "positive" | "neutral" | "negative") => void;
  currentRating?: "positive" | "neutral" | "negative";
}

export function FeedbackRating({ onRate, currentRating }: FeedbackRatingProps) {
  return (
    <div className="flex gap-2 items-center">
      <Button
        variant="feedback"
        size="sm"
        onClick={() => onRate("positive")}
        className={`p-2 rounded-full ${
          currentRating === "positive" 
            ? "bg-feedback-positive text-white" 
            : "bg-background border-2 border-feedback-positive text-feedback-positive hover:bg-feedback-positive hover:text-white"
        }`}
      >
        <ThumbsUp className="h-4 w-4" />
      </Button>
      
      <Button
        variant="feedback"
        size="sm"
        onClick={() => onRate("neutral")}
        className={`p-2 rounded-full ${
          currentRating === "neutral" 
            ? "bg-feedback-neutral text-white" 
            : "bg-background border-2 border-feedback-neutral text-feedback-neutral hover:bg-feedback-neutral hover:text-white"
        }`}
      >
        <Minus className="h-4 w-4" />
      </Button>
      
      <Button
        variant="feedback"
        size="sm"
        onClick={() => onRate("negative")}
        className={`p-2 rounded-full ${
          currentRating === "negative" 
            ? "bg-feedback-negative text-white" 
            : "bg-background border-2 border-feedback-negative text-feedback-negative hover:bg-feedback-negative hover:text-white"
        }`}
      >
        <ThumbsDown className="h-4 w-4" />
      </Button>
    </div>
  );
}