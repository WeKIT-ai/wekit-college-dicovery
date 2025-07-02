import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Users, MessageCircle, Plus, Search, TrendingUp, Award, Calendar } from "lucide-react";
import { Link } from "react-router-dom";

interface Forum {
  id: string;
  title: string;
  description: string | null;
  category: string;
  college_id?: string | null;
  course?: string | null;
  created_at: string;
  created_by: string | null;
  post_count: number;
}

interface ForumPost {
  id: string;
  title: string;
  content: string;
  upvotes: number;
  reply_count: number;
  created_at: string;
  user_id: string;
}

export default function Community() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [forums, setForums] = useState<Forum[]>([]);
  const [recentPosts, setRecentPosts] = useState<ForumPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [showCreateForum, setShowCreateForum] = useState(false);
  const [newForum, setNewForum] = useState({
    title: "",
    description: "",
    category: "general",
    college_id: "",
    course: ""
  });

  const categories = [
    { value: "all", label: "All Topics", icon: Users },
    { value: "general", label: "General Discussion", icon: MessageCircle },
    { value: "college-specific", label: "College Specific", icon: Award },
    { value: "course-specific", label: "Course Specific", icon: TrendingUp },
    { value: "career", label: "Career Guidance", icon: Calendar }
  ];

  useEffect(() => {
    fetchForums();
    fetchRecentPosts();
  }, [activeCategory, searchQuery]);

  const fetchForums = async () => {
    try {
      let query = supabase
        .from('forums')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (activeCategory !== 'all') {
        query = query.eq('category', activeCategory);
      }

      if (searchQuery) {
        query = query.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
      }

      const { data, error } = await query;
      if (error) throw error;

      // Get post counts for each forum
      const forumsWithCounts = await Promise.all(
        (data || []).map(async (forum) => {
          const { count } = await supabase
            .from('forum_posts')
            .select('*', { count: 'exact', head: true })
            .eq('forum_id', forum.id);
          
          return { ...forum, post_count: count || 0 };
        })
      );

      setForums(forumsWithCounts);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch forums",
        variant: "destructive"
      });
    }
  };

  const fetchRecentPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('forum_posts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      setRecentPosts(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch recent posts",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createForum = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to create a forum",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('forums')
        .insert({
          ...newForum,
          created_by: user.id,
          college_id: newForum.college_id || null
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Forum created successfully!"
      });

      setShowCreateForum(false);
      setNewForum({
        title: "",
        description: "",
        category: "general",
        college_id: "",
        course: ""
      });
      fetchForums();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create forum",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading community...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="container mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">WeKIT Community</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Connect with fellow students, share experiences, and get guidance from seniors and alumni
          </p>
        </div>

        {/* Search and Actions */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="text"
              placeholder="Search forums and discussions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          {user && (
            <Dialog open={showCreateForum} onOpenChange={setShowCreateForum}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Forum
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Forum</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Input
                    placeholder="Forum title"
                    value={newForum.title}
                    onChange={(e) => setNewForum({ ...newForum, title: e.target.value })}
                  />
                  <Textarea
                    placeholder="Forum description"
                    value={newForum.description}
                    onChange={(e) => setNewForum({ ...newForum, description: e.target.value })}
                  />
                  <Select value={newForum.category} onValueChange={(value) => setNewForum({ ...newForum, category: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General Discussion</SelectItem>
                      <SelectItem value="college-specific">College Specific</SelectItem>
                      <SelectItem value="course-specific">Course Specific</SelectItem>
                      <SelectItem value="career">Career Guidance</SelectItem>
                    </SelectContent>
                  </Select>
                  {(newForum.category === 'course-specific') && (
                    <Input
                      placeholder="Course name"
                      value={newForum.course}
                      onChange={(e) => setNewForum({ ...newForum, course: e.target.value })}
                    />
                  )}
                  <Button onClick={createForum} className="w-full">
                    Create Forum
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>

        <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <TabsTrigger key={category.value} value={category.value} className="flex items-center gap-2">
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{category.label}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          <div className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Forums List */}
              <div className="lg:col-span-2">
                <div className="space-y-4">
                  {forums.length === 0 ? (
                    <Card>
                      <CardContent className="text-center py-12">
                        <MessageCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-xl font-semibold mb-2">No forums found</h3>
                        <p className="text-muted-foreground mb-4">
                          Be the first to start a discussion in this category!
                        </p>
                        {user && (
                          <Button onClick={() => setShowCreateForum(true)}>
                            Create Forum
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  ) : (
                    forums.map((forum) => (
                      <Card key={forum.id} className="hover:shadow-md transition-shadow">
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <CardTitle className="text-lg mb-2">
                                <Link 
                                  to={`/community/forum/${forum.id}`}
                                  className="hover:text-primary transition-colors"
                                >
                                  {forum.title}
                                </Link>
                              </CardTitle>
                              <p className="text-muted-foreground text-sm mb-3">
                                {forum.description}
                              </p>
                              <div className="flex items-center gap-2 flex-wrap">
                                <Badge variant="secondary">{forum.category.replace('-', ' ')}</Badge>
                                {forum.course && <Badge variant="outline">{forum.course}</Badge>}
                              </div>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <div className="flex items-center gap-4">
                              <span>{forum.post_count} posts</span>
                              <span>by Forum Creator</span>
                            </div>
                            <span>{new Date(forum.created_at).toLocaleDateString()}</span>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Recent Posts */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Recent Posts
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {recentPosts.map((post) => (
                        <div key={post.id} className="border-b border-border last:border-0 pb-3 last:pb-0">
                          <h4 className="font-medium text-sm mb-1 line-clamp-2">
                            {post.title}
                          </h4>
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>by Community Member</span>
                            <span>{post.upvotes} ↑</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Community Stats */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="h-5 w-5" />
                      Community Stats
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Total Forums</span>
                        <span className="font-medium">{forums.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Active Discussions</span>
                        <span className="font-medium">{recentPosts.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Your Contributions</span>
                        <span className="font-medium">0</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                {!user && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Join the Community</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">
                        Sign in to participate in discussions, create forums, and connect with other students.
                      </p>
                      <Button asChild className="w-full">
                        <Link to="/auth">Sign In</Link>
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </Tabs>
      </div>
    </div>
  );
}