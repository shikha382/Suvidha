import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ThumbsUp, Flame } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import Confetti from "./Confetti";

interface UpvoteButtonProps {
  complaintId: string;
  initialUpvotes: number;
  initialUpvoted?: boolean;
  size?: "sm" | "md" | "lg";
  showCount?: boolean;
  onUpvote?: (complaintId: string, upvoted: boolean) => void;
}

const UpvoteButton = ({
  complaintId,
  initialUpvotes,
  initialUpvoted = false,
  size = "md",
  showCount = true,
  onUpvote
}: UpvoteButtonProps) => {
  const [upvotes, setUpvotes] = useState(initialUpvotes);
  const [upvoted, setUpvoted] = useState(initialUpvoted);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const { toast } = useToast();

  const handleUpvote = () => {
    const newUpvoted = !upvoted;
    const newCount = newUpvoted ? upvotes + 1 : upvotes - 1;
    
    setUpvoted(newUpvoted);
    setUpvotes(newCount);
    setIsAnimating(true);

    // Show confetti for milestone upvotes
    if (newUpvoted && (newCount === 10 || newCount === 50 || newCount === 100)) {
      setShowConfetti(true);
      toast({
        title: "🎉 Milestone reached!",
        description: `This issue reached ${newCount} upvotes!`,
      });
    }

    setTimeout(() => setIsAnimating(false), 300);
    onUpvote?.(complaintId, newUpvoted);
  };

  const sizeClasses = {
    sm: "h-8 px-2 text-sm gap-1",
    md: "h-10 px-3 gap-2",
    lg: "h-12 px-4 text-lg gap-2"
  };

  const iconSizes = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6"
  };

  const isTrending = upvotes >= 50;

  // Auto-hide confetti after animation
  useEffect(() => {
    if (showConfetti) {
      const timer = setTimeout(() => setShowConfetti(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showConfetti]);

  return (
    <>
      <Confetti trigger={showConfetti} />
      <Button
        variant={upvoted ? "default" : "outline"}
        className={cn(
          sizeClasses[size],
          "relative overflow-hidden transition-all duration-200",
          upvoted && "bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 border-0",
          isAnimating && "scale-110",
          isTrending && !upvoted && "border-orange-400 text-orange-600 hover:bg-orange-50"
        )}
        onClick={handleUpvote}
      >
        <ThumbsUp
          className={cn(
            iconSizes[size],
            "transition-transform",
            upvoted && "fill-current",
            isAnimating && "animate-bounce"
          )}
        />
        
        {showCount && (
          <span className={cn(
            "font-semibold",
            isAnimating && "animate-pulse"
          )}>
            {upvotes}
          </span>
        )}

        {isTrending && (
          <Flame className={cn(
            "h-3 w-3 text-orange-500 absolute -top-1 -right-1",
            upvoted && "text-yellow-300"
          )} />
        )}
      </Button>
    </>
  );
};

export default UpvoteButton;
