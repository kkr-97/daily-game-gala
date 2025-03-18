
import { useState } from "react";
import { format, parseISO } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  CalendarIcon, 
  Trash2, 
  ArrowRightLeft, 
  Users, 
  HelpCircle, 
  Loader2,
  AlertCircle
} from "lucide-react";
import { dailyGamesApi, handleApiError, SillyQuestionResponse, MostLikelyQuestionResponse, ThisOrThatPairingResponse } from "@/services/api";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const ViewDailyQuestions = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedTab, setSelectedTab] = useState("silly");
  const queryClient = useQueryClient();
  
  const formattedDate = date ? format(date, "yyyy-MM-dd") : "";
  
  // Query for Silly Questions
  const sillyQuestionsQuery = useQuery({
    queryKey: ['sillyQuestions', formattedDate],
    queryFn: () => dailyGamesApi.getSillyQuestions(formattedDate),
    enabled: !!formattedDate,
    retry: false
  });
  
  // Query for Most Likely Questions
  const mostLikelyQuestionsQuery = useQuery({
    queryKey: ['mostLikelyQuestions', formattedDate],
    queryFn: () => dailyGamesApi.getMostLikelyQuestions(formattedDate),
    enabled: !!formattedDate,
    retry: false
  });
  
  // Query for This or That Pairings
  const thisOrThatPairingsQuery = useQuery({
    queryKey: ['thisOrThatPairings', formattedDate],
    queryFn: () => dailyGamesApi.getThisOrThatPairings(formattedDate),
    enabled: !!formattedDate,
    retry: false
  });
  
  const handleDeleteSillyQuestion = async (questionId: string) => {
    try {
      await dailyGamesApi.deleteSillyQuestion(questionId);
      toast.success("Silly question deleted successfully");
      queryClient.invalidateQueries({ queryKey: ['sillyQuestions', formattedDate] });
    } catch (error) {
      handleApiError(error);
    }
  };
  
  const handleDeleteMostLikelyQuestion = async (questionId: string) => {
    try {
      await dailyGamesApi.deleteMostLikelyQuestion(questionId);
      toast.success("Most Likely question deleted successfully");
      queryClient.invalidateQueries({ queryKey: ['mostLikelyQuestions', formattedDate] });
    } catch (error) {
      handleApiError(error);
    }
  };
  
  const handleDeleteThisOrThatPairing = async (pairingId: string) => {
    try {
      await dailyGamesApi.deleteThisOrThatPairing(pairingId);
      toast.success("This or That pairing deleted successfully");
      queryClient.invalidateQueries({ queryKey: ['thisOrThatPairings', formattedDate] });
    } catch (error) {
      handleApiError(error);
    }
  };
  
  return (
    <Card className="w-full animate-slide-up">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-semibold flex items-center gap-2">
          View & Manage Daily Questions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <div className="flex items-center space-x-2 mb-4">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="silly" className="flex items-center gap-2">
              <HelpCircle className="w-4 h-4" /> Silly Questions
            </TabsTrigger>
            <TabsTrigger value="mostLikely" className="flex items-center gap-2">
              <Users className="w-4 h-4" /> Most Likely
            </TabsTrigger>
            <TabsTrigger value="thisOrThat" className="flex items-center gap-2">
              <ArrowRightLeft className="w-4 h-4" /> This or That
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="silly">
            {sillyQuestionsQuery.isLoading ? (
              <div className="flex items-center justify-center py-10">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : sillyQuestionsQuery.isError ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <AlertCircle className="w-10 h-10 text-destructive mb-2" />
                <p>No silly question found for this date.</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Question</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>{sillyQuestionsQuery.data?.question}</TableCell>
                    <TableCell>
                      {sillyQuestionsQuery.data?.questionDate && format(parseISO(sillyQuestionsQuery.data.questionDate), "PPP")}
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handleDeleteSillyQuestion(sillyQuestionsQuery.data?.questionId || '')}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            )}
          </TabsContent>
          
          <TabsContent value="mostLikely">
            {mostLikelyQuestionsQuery.isLoading ? (
              <div className="flex items-center justify-center py-10">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : mostLikelyQuestionsQuery.isError ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <AlertCircle className="w-10 h-10 text-destructive mb-2" />
                <p>No Most Likely questions found for this date.</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Question</TableHead>
                    <TableHead>Image URL</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mostLikelyQuestionsQuery.data?.todayMostLikelyQuestions.map((question: MostLikelyQuestionResponse) => (
                    <TableRow key={question.questionId}>
                      <TableCell>{question.questionText}</TableCell>
                      <TableCell>
                        {question.imageUrl ? (
                          <Badge variant="outline" className="truncate max-w-[200px]">
                            {question.imageUrl}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground">None</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleDeleteMostLikelyQuestion(question.questionId)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </TabsContent>
          
          <TabsContent value="thisOrThat">
            {thisOrThatPairingsQuery.isLoading ? (
              <div className="flex items-center justify-center py-10">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : thisOrThatPairingsQuery.isError ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <AlertCircle className="w-10 h-10 text-destructive mb-2" />
                <p>No This or That pairings found for this date.</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Option 1</TableHead>
                    <TableHead>Option 2</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {thisOrThatPairingsQuery.data?.map((pairing: ThisOrThatPairingResponse) => (
                    <TableRow key={pairing.pairingId}>
                      <TableCell>{pairing.option1.optionText}</TableCell>
                      <TableCell>{pairing.option2.optionText}</TableCell>
                      <TableCell>
                        {pairing.validDate && format(parseISO(pairing.validDate), "PPP")}
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleDeleteThisOrThatPairing(pairing.pairingId)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ViewDailyQuestions;
