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
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      toast.error("Please select a valid image file (JPG, JPEG, or PNG)");
      return;
    }

    setIsUploadingImage(true);

    try {
      // Get pre-signed URL with content type
      const response = await dailyGamesApi.getMostLikelyImageUploadUrl(file.type);

      // Upload image to S3
      const uploadResponse = await fetch(response.preSignedURL, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type
        }
      });

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload image');
      }

      // Set the object key as the image URL
      setImageUrl(response.objectKey);
      toast.success("Image uploaded successfully");
    } catch (error) {
      handleApiError(error);
      setImageUrl("");
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!questionText.trim() || !date) {
      toast.error("Question text and date are required");
      return;
    }
    
    setIsSubmitting(true);
    console.log('Image URL:', imageUrl);
    try {
      const data: MostLikelyQuestion = {
        questionText: questionText.trim(),
        date,
        imageUrl: imageUrl || undefined // Only include if it has a value
      };
      
      await dailyGamesApi.postMostLikelyQuestion(data);
      toast.success("Most Likely question posted successfully");
      
      // Reset form
      setQuestionText("");
      setImageUrl("");
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
              onChange={handleImageUpload}
              className="input-focus-ring"
              disabled={isUploadingImage}
            />
            {imageUrl && (
              <p className="text-sm text-muted-foreground">
                Image uploaded successfully
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
            disabled={isSubmitting || isUploadingImage}
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
