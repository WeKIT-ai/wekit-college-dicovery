import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Calendar, Clock, User, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { CalendlyEmbed } from "./CalendlyEmbed";

interface SchedulingRequestProps {
  mentor: {
    id: string;
    first_name: string;
    last_name: string;
    bio?: string;
    calendly_username?: string;
    calendly_event_type?: string;
    scheduling_enabled?: boolean;
  };
  onRequestCreated?: (requestId: string) => void;
  showEmbed?: boolean;
}

export function SchedulingRequest({ 
  mentor, 
  onRequestCreated,
  showEmbed = false 
}: SchedulingRequestProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [showScheduling, setShowScheduling] = useState(showEmbed);
  const [requestData, setRequestData] = useState({
    subject: "",
    description: "",
    preferred_time: ""
  });

  const handleCreateRequest = async () => {
    if (!requestData.subject.trim() || !requestData.description.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in both subject and description.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.rpc('create_scheduling_request', {
        p_mentee_id: null, // Will be set by RLS to current user
        p_mentor_id: mentor.id,
        p_subject: requestData.subject,
        p_description: requestData.description,
        p_preferred_time: requestData.preferred_time || null
      });

      if (error) throw error;

      toast({
        title: "Request Created",
        description: "Your scheduling request has been sent to the mentor."
      });

      if (onRequestCreated) {
        onRequestCreated(data);
      }

      // Show scheduling interface if mentor has Calendly enabled
      if (mentor.scheduling_enabled && mentor.calendly_username && mentor.calendly_event_type) {
        setShowScheduling(true);
      }

      // Reset form
      setRequestData({
        subject: "",
        description: "",
        preferred_time: ""
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create scheduling request",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEventScheduled = (eventData: any) => {
    toast({
      title: "Session Scheduled!",
      description: "Your mentoring session has been successfully scheduled."
    });
    
    // Here you would update the mentoring request with the Calendly event details
    console.log('Calendly event scheduled:', eventData);
  };

  const calendlyUrl = mentor.calendly_username && mentor.calendly_event_type
    ? `https://calendly.com/${mentor.calendly_username}/${mentor.calendly_event_type}`
    : null;

  if (showScheduling && calendlyUrl) {
    return (
      <div className="space-y-4">
        <Button 
          variant="outline" 
          onClick={() => setShowScheduling(false)}
          className="mb-4"
        >
          ← Back to Request Form
        </Button>
        <CalendlyEmbed
          calendlyUrl={calendlyUrl}
          mentorName={`${mentor.first_name} ${mentor.last_name}`}
          sessionType="Mentoring Session"
          onEventScheduled={handleEventScheduled}
        />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Request Mentoring Session
        </CardTitle>
        <div className="flex items-center gap-2 text-muted-foreground">
          <User className="h-4 w-4" />
          <span>{mentor.first_name} {mentor.last_name}</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="subject">Session Topic</Label>
          <Input
            id="subject"
            placeholder="e.g., College Application Guidance"
            value={requestData.subject}
            onChange={(e) => setRequestData({ ...requestData, subject: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">What would you like to discuss?</Label>
          <Textarea
            id="description"
            placeholder="Describe what you'd like help with and any specific questions you have..."
            rows={4}
            value={requestData.description}
            onChange={(e) => setRequestData({ ...requestData, description: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="preferred-time">Preferred Time (Optional)</Label>
          <Input
            id="preferred-time"
            placeholder="e.g., Weekday evenings, Next week"
            value={requestData.preferred_time}
            onChange={(e) => setRequestData({ ...requestData, preferred_time: e.target.value })}
          />
        </div>

        {mentor.scheduling_enabled && calendlyUrl ? (
          <div className="pt-4 border-t">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium mb-1">Quick Scheduling Available</h4>
                <p className="text-sm text-muted-foreground">
                  This mentor offers instant scheduling through Calendly
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => setShowScheduling(true)}
                className="flex items-center gap-2"
              >
                <Calendar className="h-4 w-4" />
                Schedule Now
              </Button>
            </div>
          </div>
        ) : null}

        <Button 
          onClick={handleCreateRequest} 
          disabled={loading}
          className="w-full"
        >
          <Clock className="h-4 w-4 mr-2" />
          {loading ? "Sending Request..." : "Send Request"}
        </Button>
      </CardContent>
    </Card>
  );
}