import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { User, Edit, Trophy, Activity, Coins, Star, Calendar, MapPin, BookOpen, Settings } from "lucide-react";
import { Link } from "react-router-dom";

interface UserProfile {
  id: string;
  user_id: string;
  full_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  college: string | null;
  course: string | null;
  graduation_year: number | null;
  current_position: string | null;
  location: string | null;
  interests: string[] | null;
  coins_balance: number;
  total_contributions: number;
  reputation_score: number;
  badges: string[] | null;
}

interface UserActivity {
  id: string;
  activity_type: string;
  points_earned: number;
  description: string | null;
  created_at: string;
}

export default function Profile() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [activities, setActivities] = useState<UserActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editProfile, setEditProfile] = useState({
    full_name: "",
    bio: "",
    college: "",
    course: "",
    graduation_year: "",
    current_position: "",
    location: "",
    interests: ""
  });

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchActivities();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      
      setProfile(data);
      setEditProfile({
        full_name: data.full_name || "",
        bio: data.bio || "",
        college: data.college || "",
        course: data.course || "",
        graduation_year: data.graduation_year?.toString() || "",
        current_position: data.current_position || "",
        location: data.location || "",
        interests: data.interests?.join(", ") || ""
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch profile",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchActivities = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_activities')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setActivities(data || []);
    } catch (error: any) {
      console.error("Failed to fetch activities:", error);
    }
  };

  const updateProfile = async () => {
    if (!user || !profile) return;

    try {
      const interests = editProfile.interests 
        ? editProfile.interests.split(",").map(item => item.trim()).filter(Boolean)
        : [];

      const { error } = await supabase
        .from('user_profiles')
        .update({
          full_name: editProfile.full_name,
          bio: editProfile.bio,
          college: editProfile.college,
          course: editProfile.course,
          graduation_year: editProfile.graduation_year ? parseInt(editProfile.graduation_year) : null,
          current_position: editProfile.current_position,
          location: editProfile.location,
          interests: interests
        })
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Profile updated successfully!"
      });

      setEditing(false);
      fetchProfile();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update profile",
        variant: "destructive"
      });
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'review_posted':
        return <Star className="h-4 w-4" />;
      case 'photo_uploaded':
        return <User className="h-4 w-4" />;
      case 'forum_post':
        return <Activity className="h-4 w-4" />;
      default:
        return <Trophy className="h-4 w-4" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'review_posted':
        return 'text-yellow-500';
      case 'photo_uploaded':
        return 'text-blue-500';
      case 'forum_post':
        return 'text-green-500';
      default:
        return 'text-purple-500';
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
              Please sign in to view your profile.
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
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Profile Header */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-6">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={profile?.avatar_url || ""} />
                  <AvatarFallback className="text-lg">
                    {profile?.full_name?.charAt(0) || user.email?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-3xl font-bold mb-2">
                    {profile?.full_name || user.email}
                  </h1>
                  <div className="flex items-center gap-4 text-muted-foreground">
                    {profile?.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {profile.location}
                      </div>
                    )}
                    {profile?.college && (
                      <div className="flex items-center gap-1">
                        <BookOpen className="h-4 w-4" />
                        {profile.college}
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Joined {new Date(user.created_at || '').toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => setEditing(true)}
                  className="flex items-center gap-2"
                >
                  <Edit className="h-4 w-4" />
                  Edit Profile
                </Button>
                <Button asChild variant="outline" className="flex items-center gap-2">
                  <Link to="/mentor-scheduling">
                    <Settings className="h-4 w-4" />
                    Scheduling
                  </Link>
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {profile?.bio && (
              <p className="text-muted-foreground mb-4">{profile.bio}</p>
            )}
            
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-gradient-card rounded-lg">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Coins className="h-5 w-5 text-primary" />
                  <span className="text-2xl font-bold">{profile?.coins_balance || 0}</span>
                </div>
                <p className="text-sm text-muted-foreground">WeKIT Coins</p>
              </div>
              <div className="text-center p-4 bg-gradient-card rounded-lg">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Activity className="h-5 w-5 text-green-500" />
                  <span className="text-2xl font-bold">{profile?.total_contributions || 0}</span>
                </div>
                <p className="text-sm text-muted-foreground">Contributions</p>
              </div>
              <div className="text-center p-4 bg-gradient-card rounded-lg">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  <span className="text-2xl font-bold">{profile?.reputation_score || 0}</span>
                </div>
                <p className="text-sm text-muted-foreground">Reputation</p>
              </div>
              <div className="text-center p-4 bg-gradient-card rounded-lg">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Trophy className="h-5 w-5 text-purple-500" />
                  <span className="text-2xl font-bold">{profile?.badges?.length || 0}</span>
                </div>
                <p className="text-sm text-muted-foreground">Badges</p>
              </div>
            </div>

            {/* Interests and Badges */}
            {(profile?.interests?.length || profile?.badges?.length) && (
              <div className="mt-6 space-y-4">
                {profile?.interests?.length && (
                  <div>
                    <h3 className="font-semibold mb-2">Interests</h3>
                    <div className="flex flex-wrap gap-2">
                      {profile.interests.map((interest, index) => (
                        <Badge key={index} variant="secondary">{interest}</Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                {profile?.badges?.length && (
                  <div>
                    <h3 className="font-semibold mb-2">Badges</h3>
                    <div className="flex flex-wrap gap-2">
                      {profile.badges.map((badge, index) => (
                        <Badge key={index} variant="default">{badge}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Tabs defaultValue="activity" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="activity">Recent Activity</TabsTrigger>
            <TabsTrigger value="edit" disabled={!editing}>
              {editing ? "Editing Profile" : "Edit Profile"}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="activity" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                {activities.length === 0 ? (
                  <div className="text-center py-8">
                    <Activity className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No activity yet</h3>
                    <p className="text-muted-foreground">
                      Start contributing to the community to see your activity here!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {activities.map((activity) => (
                      <div key={activity.id} className="flex items-center gap-3 p-3 border border-border rounded-lg">
                        <div className={`p-2 rounded-full ${getActivityColor(activity.activity_type)}`}>
                          {getActivityIcon(activity.activity_type)}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{activity.description || activity.activity_type}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(activity.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        {activity.points_earned > 0 && (
                          <Badge variant="secondary">
                            +{activity.points_earned} coins
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {editing && (
            <TabsContent value="edit" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Edit Profile</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Full Name</label>
                      <Input
                        value={editProfile.full_name}
                        onChange={(e) => setEditProfile({ ...editProfile, full_name: e.target.value })}
                        placeholder="Your full name"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Location</label>
                      <Input
                        value={editProfile.location}
                        onChange={(e) => setEditProfile({ ...editProfile, location: e.target.value })}
                        placeholder="City, State"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Bio</label>
                    <Textarea
                      value={editProfile.bio}
                      onChange={(e) => setEditProfile({ ...editProfile, bio: e.target.value })}
                      placeholder="Tell us about yourself..."
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">College</label>
                      <Input
                        value={editProfile.college}
                        onChange={(e) => setEditProfile({ ...editProfile, college: e.target.value })}
                        placeholder="Your college/university"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Course</label>
                      <Input
                        value={editProfile.course}
                        onChange={(e) => setEditProfile({ ...editProfile, course: e.target.value })}
                        placeholder="Your course/major"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Graduation Year</label>
                      <Input
                        type="number"
                        value={editProfile.graduation_year}
                        onChange={(e) => setEditProfile({ ...editProfile, graduation_year: e.target.value })}
                        placeholder="e.g., 2024"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Current Position</label>
                      <Input
                        value={editProfile.current_position}
                        onChange={(e) => setEditProfile({ ...editProfile, current_position: e.target.value })}
                        placeholder="Student, Working Professional, etc."
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Interests</label>
                    <Input
                      value={editProfile.interests}
                      onChange={(e) => setEditProfile({ ...editProfile, interests: e.target.value })}
                      placeholder="Technology, Sports, Music (comma separated)"
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={updateProfile}>Save Changes</Button>
                    <Button variant="outline" onClick={() => setEditing(false)}>
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
}