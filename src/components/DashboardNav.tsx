
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, ListChecks } from "lucide-react";
import ThisOrThatForm from "./ThisOrThatForm";
import MostLikelyForm from "./MostLikelyForm";
import SillyQuestionsForm from "./SillyQuestionsForm";
import ViewDailyQuestions from "./ViewDailyQuestions";

const DashboardNav = () => {
  const [activeTab, setActiveTab] = useState<"add" | "view">("add");

  return (
    <div className="w-full mb-8">
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "add" | "view")} className="w-full">
        <div className="flex justify-center mb-8">
          <TabsList className="grid grid-cols-2 w-full max-w-md">
            <TabsTrigger value="add" className="flex items-center gap-2">
              <PlusCircle className="w-4 h-4" />
              Add Questions
            </TabsTrigger>
            <TabsTrigger value="view" className="flex items-center gap-2">
              <ListChecks className="w-4 h-4" />
              View & Manage
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="add" className="animate-in slide-in-from 
          duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            <ThisOrThatForm />
            <MostLikelyForm />
            <SillyQuestionsForm />
          </div>
        </TabsContent>
        
        <TabsContent value="view" className="animate-in slide-in-from
          duration-300">
          <ViewDailyQuestions />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DashboardNav;
