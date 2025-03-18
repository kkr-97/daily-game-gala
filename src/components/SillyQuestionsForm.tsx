
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { dailyGamesApi, handleApiError, SillyQuestion } from "@/services/api";
import { toast } from "sonner";
import { Calendar, HelpCircle, Loader2 } from "lucide-react";

const SillyQuestionsForm = () => {
  const [question, setQuestion] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!question.trim() || !date) {
      toast.error("Question and date are required");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const data: SillyQuestion = {
        question,
        date
      };
      
      await dailyGamesApi.postSillyQuestion(data);
      toast.success("Silly question posted successfully");
      
      // Reset form
      setQuestion("");
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full animate-slide-up game-card border-2 border-game-silly-questions/20 shadow-lg shadow-game-silly-questions/10">
      <CardHeader className="pb-3">
        <div className="inline-flex items-center px-3 py-1 mb-2 text-xs font-medium rounded-full bg-game-silly-questions/10 text-game-silly-questions">
          Daily Game
        </div>
        <CardTitle className="text-xl font-semibold text-game-silly-questions flex items-center gap-2">
          <HelpCircle className="w-5 h-5" />
          Silly Questions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2 form-field">
            <Label htmlFor="question">Question</Label>
            <Input
              id="question"
              placeholder="Enter silly question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="input-focus-ring"
              required
            />
          </div>
          
          <div className="space-y-2 form-field">
            <Label htmlFor="silly-date" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" /> Date
            </Label>
            <Input
              id="silly-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="input-focus-ring"
              required
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full transition-all duration-300 hover:opacity-90 bg-game-silly-questions hover:bg-game-silly-questions/90"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Posting...
              </>
            ) : (
              "Post Silly Question"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default SillyQuestionsForm;
