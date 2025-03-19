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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      toast.error("Please select a valid image file (JPG, JPEG, or PNG)");
      return;
    }

    setSelectedFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!questionText.trim() || !date) {
      toast.error("Question text and date are required");
      return;
    }
    
    setIsSubmitting(true);

    try {
      let imageUrl: string | undefined;

      // Only handle image upload if a file is selected
      if (selectedFile) {
        // 1. Get pre-signed URL
        const uploadUrlResponse = await dailyGamesApi.getMostLikelyImageUploadUrl(selectedFile.type);
        
        // 2. Upload image to S3
        const arrayBuffer = await selectedFile.arrayBuffer();
        const uploadResponse = await fetch(uploadUrlResponse.preSignedURL, {
          method: 'PUT',
          body: arrayBuffer,
          headers: {
            'Content-Type': selectedFile.type
          }
        });

        if (!uploadResponse.ok) {
          throw new Error('Failed to upload image');
        }

        imageUrl = uploadUrlResponse.objectKey;
      }

      // 3. Submit the form with image URL if available
      const data: MostLikelyQuestion = {
        questionText: questionText.trim(),
        date,
        imageUrl
      };
      
      await dailyGamesApi.postMostLikelyQuestion(data);
      toast.success("Most Likely question posted successfully");
      
      // Reset form
      setQuestionText("");
      setSelectedFile(null);
      setDate(new Date().toISOString().split('T')[0]);
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
            <Label htmlFor="image" className="flex items-center gap-2">
              <Image className="w-4 h-4" /> Image
            </Label>
            <Input
              id="image"
              type="file"
              accept="image/jpeg,image/jpg,image/png"
              onChange={handleFileSelect}
              className="input-focus-ring"
              disabled={isSubmitting}
            />
            {selectedFile && (
              <p className="text-sm text-muted-foreground">
                File selected: {selectedFile.name}
              </p>
            )}
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
