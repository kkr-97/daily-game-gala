
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { dailyGamesApi, handleApiError, ThisOrThatPairing } from "@/services/api";
import { toast } from "sonner";
import { ArrowRightLeft, Calendar, Loader2 } from "lucide-react";

const ThisOrThatForm = () => {
  const [option1, setOption1] = useState("");
  const [option2, setOption2] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!option1.trim() || !option2.trim() || !date) {
      toast.error("All fields are required");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const data: ThisOrThatPairing = {
        option1Text: option1,
        option2Text: option2,
        date
      };
      
      await dailyGamesApi.postThisOrThatPairing(data);
      toast.success("This or That question posted successfully");
      
      // Reset form
      setOption1("");
      setOption2("");
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full animate-slide-up game-card border-2 border-game-this-or-that/20 shadow-lg shadow-game-this-or-that/10">
      <CardHeader className="pb-3">
        <div className="inline-flex items-center px-3 py-1 mb-2 text-xs font-medium rounded-full bg-game-this-or-that/10 text-game-this-or-that">
          Daily Game
        </div>
        <CardTitle className="text-xl font-semibold text-game-this-or-that flex items-center gap-2">
          <ArrowRightLeft className="w-5 h-5" />
          This or That
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2 form-field">
            <Label htmlFor="option1">Option 1</Label>
            <Input
              id="option1"
              placeholder="Enter first option"
              value={option1}
              onChange={(e) => setOption1(e.target.value)}
              className="input-focus-ring"
              required
            />
          </div>
          
          <div className="space-y-2 form-field">
            <Label htmlFor="option2">Option 2</Label>
            <Input
              id="option2"
              placeholder="Enter second option"
              value={option2}
              onChange={(e) => setOption2(e.target.value)}
              className="input-focus-ring"
              required
            />
          </div>
          
          <div className="space-y-2 form-field">
            <Label htmlFor="thisorthat-date" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" /> Date
            </Label>
            <Input
              id="thisorthat-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="input-focus-ring"
              required
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full transition-all duration-300 hover:opacity-90 bg-game-this-or-that hover:bg-game-this-or-that/90"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Posting...
              </>
            ) : (
              "Post This or That Question"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ThisOrThatForm;
