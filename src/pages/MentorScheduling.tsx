import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { MentorScheduling as MentorSchedulingComponent } from "@/components/scheduling/MentorScheduling";
import { SchedulingRequest } from "@/components/scheduling/SchedulingRequest";
import { Calendar, Clock, Users, Settings, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

interface MentorProfile {
  id: string;
  first_name: string;
  last_name: string;
  bio?: string;
  calendly_username?: string;
  calendly_event_type?: string;
  scheduling_enabled?: boolean;
  booking_preferences?: any;
}

interface MentoringRequest {
  id: string;
  subject: string;
  description: string;
  status: string;
  scheduling_status: string;
  scheduled_at?: string;
  meeting_link?: string;
  created_at: string;
  mentee_profiles?: {
    full_name: string;
  };
}

export default function MentorScheduling() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [mentorProfile, setMentorProfile] = useState<MentorProfile | null>(null);
  const [requests, setRequests] = useState<MentoringRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchMentorProfile();
      fetchSchedulingRequests();
    }
  }, [user]);

  const fetchMentorProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('mentor_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      setMentorProfile(data);
    } catch (error: any) {
      console.error('Error fetching mentor profile:', error);
    }
  };

  const fetchSchedulingRequests = async () => {
    if (!user || !mentorProfile) return;

    try {
      const { data, error } = await supabase
        .from('mentoring_requests')
        .select(`
          *,
          user_profiles!mentoring_requests_mentee_id_fkey (
            full_name
          )
        `)
        .eq('mentor_id', mentorProfile.id)
        .eq('is_scheduling_request', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRequests(data || []);
    } catch (error: any) {
      console.error('Error fetching requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRequest = async (requestId: string, updates: Partial<MentoringRequest>) => {
    try {
      const { error } = await supabase
        .from('mentoring_requests')
        .update(updates)
        .eq('id', requestId);

      if (error) throw error;

      toast({
        title: "Request Updated",
        description: "The scheduling request has been updated."
      });

      fetchSchedulingRequests();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update request",
        variant: "destructive"
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'scheduled': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Please sign in to access mentor scheduling.
            </p>
            <Button asChild className="w-full">
              <Link to="/auth">Sign In</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading scheduling dashboard...</p>
        </div>
      </div>
    );
  }

  if (!mentorProfile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>Mentor Profile Required</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              You need to create a mentor profile to access scheduling features.
            </p>
            <Button asChild className="w-full">
              <Link to="/profile">Create Mentor Profile</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-6">
          <Button variant="outline" asChild className="mb-4">
            <Link to="/profile">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Profile
            </Link>
          </Button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Scheduling Dashboard</h1>
              <p className="text-muted-foreground">
                Manage your availability and mentoring session requests
              </p>
            </div>
            <Badge variant={mentorProfile.scheduling_enabled ? "default" : "secondary"}>
              {mentorProfile.scheduling_enabled ? "Scheduling Enabled" : "Scheduling Disabled"}
            </Badge>
          </div>
        </div>

        <Tabs defaultValue="settings" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </TabsTrigger>
            <TabsTrigger value="requests" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Requests ({requests.length})
            </TabsTrigger>
            <TabsTrigger value="preview" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Preview
            </TabsTrigger>
          </TabsList>

          <TabsContent value="settings" className="space-y-6">
            <MentorSchedulingComponent 
              mentorProfile={mentorProfile}
              onUpdate={fetchMentorProfile}
            />
          </TabsContent>

          <TabsContent value="requests" className="space-y-4">
            {requests.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Scheduling Requests</h3>
                  <p className="text-muted-foreground">
                    When mentees request sessions, they'll appear here.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {requests.map((request) => (
                  <Card key={request.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{request.subject}</CardTitle>
                        <Badge className={getStatusColor(request.scheduling_status)}>
                          {request.scheduling_status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>From: {request.mentee_profiles?.full_name || 'Anonymous'}</span>
                        <span>•</span>
                        <span>{new Date(request.created_at).toLocaleDateString()}</span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="mb-4">{request.description}</p>
                      
                      {request.scheduled_at && (
                        <div className="mb-4 p-3 bg-green-50 rounded-lg">
                          <div className="flex items-center gap-2 text-sm font-medium text-green-800">
                            <Clock className="h-4 w-4" />
                            Scheduled: {new Date(request.scheduled_at).toLocaleString()}
                          </div>
                          {request.meeting_link && (
                            <a 
                              href={request.meeting_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-green-700 hover:underline"
                            >
                              Join Meeting
                            </a>
                          )}
                        </div>
                      )}

                      <div className="flex gap-2">
                        {request.scheduling_status === 'pending' && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => handleUpdateRequest(request.id, { status: 'accepted' })}
                            >
                              Accept
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleUpdateRequest(request.id, { status: 'declined' })}
                            >
                              Decline
                            </Button>
                          </>
                        )}
                        {request.scheduling_status === 'scheduled' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleUpdateRequest(request.id, { scheduling_status: 'completed' })}
                          >
                            Mark Complete
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="preview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Mentee Preview</CardTitle>
                <p className="text-muted-foreground">
                  This is how mentees will see your scheduling interface
                </p>
              </CardHeader>
              <CardContent>
                <SchedulingRequest 
                  mentor={mentorProfile}
                  showEmbed={false}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}