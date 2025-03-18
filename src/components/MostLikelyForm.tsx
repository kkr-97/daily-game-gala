
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { dailyGamesApi, handleApiError, MostLikelyQuestion } from "@/services/api";
import { toast } from "sonner";
import { Calendar, Image, Loader2, Users } from "lucide-react";

const MostLikelyForm = () => {
  const [questionText, setQuestionText] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!questionText.trim() || !date) {
      toast.error("Question text and date are required");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const data: MostLikelyQuestion = {
        questionText,
        date,
        ...(imageUrl && { imageUrl })
      };
      
      await dailyGamesApi.postMostLikelyQuestion(data);
      toast.success("Most Likely question posted successfully");
      
      // Reset form
      setQuestionText("");
      setImageUrl("");
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full animate-slide-up game-card border-2 border-game-most-likely/20 shadow-lg shadow-game-most-likely/10">
      <CardHeader className="pb-3">
        <div className="inline-flex items-center px-3 py-1 mb-2 text-xs font-medium rounded-full bg-game-most-likely/10 text-game-most-likely">
          Daily Game
        </div>
        <CardTitle className="text-xl font-semibold text-game-most-likely flex items-center gap-2">
          <Users className="w-5 h-5" />
          Most Likely
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2 form-field">
            <Label htmlFor="questionText">Question Text</Label>
            <Input
              id="questionText"
              placeholder="Enter question text"
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              className="input-focus-ring"
              required
            />
          </div>
          
          <div className="space-y-2 form-field">
            <Label htmlFor="imageUrl" className="flex items-center gap-2">
              <Image className="w-4 h-4" /> Image URL (Optional)
            </Label>
            <Input
              id="imageUrl"
              placeholder="Enter image URL (optional)"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="input-focus-ring"
            />
          </div>
          
          <div className="space-y-2 form-field">
            <Label htmlFor="mostlikely-date" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" /> Date
            </Label>
            <Input
              id="mostlikely-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="input-focus-ring"
              required
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full transition-all duration-300 hover:opacity-90 bg-game-most-likely hover:bg-game-most-likely/90"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Posting...
              </>
            ) : (
              "Post Most Likely Question"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default MostLikelyForm;
