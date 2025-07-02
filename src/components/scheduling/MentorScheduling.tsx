import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Calendar, Clock, Settings, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface MentorSchedulingProps {
  mentorProfile: any;
  onUpdate: () => void;
}

export function MentorScheduling({ mentorProfile, onUpdate }: MentorSchedulingProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [schedulingData, setSchedulingData] = useState({
    calendly_username: mentorProfile?.calendly_username || "",
    calendly_event_type: mentorProfile?.calendly_event_type || "",
    scheduling_enabled: mentorProfile?.scheduling_enabled || false,
    booking_preferences: mentorProfile?.booking_preferences || {
      buffer_time: 15,
      max_advance_days: 30,
      timezone: "UTC"
    }
  });

  const handleSave = async () => {
    if (!user || !mentorProfile) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('mentor_profiles')
        .update({
          calendly_username: schedulingData.calendly_username,
          calendly_event_type: schedulingData.calendly_event_type,
          scheduling_enabled: schedulingData.scheduling_enabled,
          booking_preferences: schedulingData.booking_preferences
        })
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: "Scheduling settings updated",
        description: "Your Calendly integration has been configured."
      });
      
      onUpdate();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update scheduling settings",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const calendlyEmbedUrl = schedulingData.calendly_username && schedulingData.calendly_event_type
    ? `https://calendly.com/${schedulingData.calendly_username}/${schedulingData.calendly_event_type}`
    : null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Scheduling Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label htmlFor="scheduling-enabled">Enable Scheduling</Label>
            <p className="text-sm text-muted-foreground">
              Allow mentees to book sessions directly through Calendly
            </p>
          </div>
          <Switch
            id="scheduling-enabled"
            checked={schedulingData.scheduling_enabled}
            onCheckedChange={(checked) => 
              setSchedulingData({ ...schedulingData, scheduling_enabled: checked })
            }
          />
        </div>

        {schedulingData.scheduling_enabled && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="calendly-username">Calendly Username</Label>
                <Input
                  id="calendly-username"
                  placeholder="your-username"
                  value={schedulingData.calendly_username}
                  onChange={(e) => 
                    setSchedulingData({ ...schedulingData, calendly_username: e.target.value })
                  }
                />
                <p className="text-xs text-muted-foreground">
                  Your Calendly username (e.g., if your link is calendly.com/john-smith, enter "john-smith")
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="event-type">Event Type</Label>
                <Input
                  id="event-type"
                  placeholder="mentoring-session"
                  value={schedulingData.calendly_event_type}
                  onChange={(e) => 
                    setSchedulingData({ ...schedulingData, calendly_event_type: e.target.value })
                  }
                />
                <p className="text-xs text-muted-foreground">
                  Your Calendly event type slug
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="buffer-time">Buffer Time (minutes)</Label>
                <Input
                  id="buffer-time"
                  type="number"
                  value={schedulingData.booking_preferences.buffer_time}
                  onChange={(e) => 
                    setSchedulingData({ 
                      ...schedulingData, 
                      booking_preferences: {
                        ...schedulingData.booking_preferences,
                        buffer_time: parseInt(e.target.value) || 15
                      }
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="max-advance">Max Advance Booking (days)</Label>
                <Input
                  id="max-advance"
                  type="number"
                  value={schedulingData.booking_preferences.max_advance_days}
                  onChange={(e) => 
                    setSchedulingData({ 
                      ...schedulingData, 
                      booking_preferences: {
                        ...schedulingData.booking_preferences,
                        max_advance_days: parseInt(e.target.value) || 30
                      }
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Input
                  id="timezone"
                  value={schedulingData.booking_preferences.timezone}
                  onChange={(e) => 
                    setSchedulingData({ 
                      ...schedulingData, 
                      booking_preferences: {
                        ...schedulingData.booking_preferences,
                        timezone: e.target.value
                      }
                    })
                  }
                />
              </div>
            </div>

            {calendlyEmbedUrl && (
              <div className="p-4 bg-gradient-card rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Preview Link:</span>
                  <Button variant="outline" size="sm" asChild>
                    <a href={calendlyEmbedUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Test Link
                    </a>
                  </Button>
                </div>
                <code className="text-xs bg-muted px-2 py-1 rounded block">
                  {calendlyEmbedUrl}
                </code>
              </div>
            )}
          </>
        )}

        <Button onClick={handleSave} disabled={loading} className="w-full">
          <Settings className="h-4 w-4 mr-2" />
          {loading ? "Saving..." : "Save Scheduling Settings"}
        </Button>
      </CardContent>
    </Card>
  );
}