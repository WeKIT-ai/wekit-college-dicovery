import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FeedbackRating } from "@/components/FeedbackRating";
import { Search, MapPin, Star, Users, Briefcase, Filter } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function Discover() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [feedbackRatings, setFeedbackRatings] = useState<Record<string, "positive" | "neutral" | "negative">>({});
  const [colleges, setColleges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    state: "",
    collegeType: "",
    institutionType: ""
  });

  useEffect(() => {
    fetchColleges();
  }, [searchQuery, filters]);

  const fetchColleges = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('colleges')
        .select(`
          *,
          college_feedback (
            id,
            overall_rating,
            academics_rating,
            campus_life_rating,
            facilities_rating,
            safety_rating,
            placements_rating,
            review_text,
            course,
            is_anonymous,
            is_verified,
            created_at
          )
        `)
        .order('nirf_ranking', { ascending: true, nullsFirst: false });

      if (searchQuery) {
        query = query.or(`name.ilike.%${searchQuery}%,city.ilike.%${searchQuery}%,state.ilike.%${searchQuery}%`);
      }

      if (filters.state) {
        query = query.eq('state', filters.state);
      }

      if (filters.collegeType) {
        query = query.eq('college_type', filters.collegeType);
      }

      if (filters.institutionType) {
        query = query.eq('institution_type', filters.institutionType);
      }

      const { data, error } = await query.limit(10);

      if (error) throw error;
      setColleges(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch colleges",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFeedbackRate = (feedbackId: string, rating: "positive" | "neutral" | "negative") => {
    setFeedbackRatings(prev => ({
      ...prev,
      [feedbackId]: rating
    }));
    
    toast({
      title: "Rating Submitted",
      description: "Thank you for rating this feedback!"
    });
  };

  const getAverageRating = (feedback: any[]) => {
    if (!feedback || !feedback.length) return 0;
    const sum = feedback.reduce((acc, curr) => acc + (curr.overall_rating || 0), 0);
    return (sum / feedback.length).toFixed(1);
  };

  const getRatingCount = (college: any) => {
    return college.college_feedback?.length || 0;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading colleges...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-hero py-16 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Discover Your Dream College
          </h1>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Real feedback from seniors and alumni to help you make the right choice
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative mb-6">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <Input
              type="text"
              placeholder="Search colleges, courses, cities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-14 text-lg bg-background/95 backdrop-blur border-0 shadow-elegant"
            />
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap gap-4 justify-center">
            <Button 
              variant="outline" 
              className="bg-white/10 border-white/20 text-white"
              onClick={() => setFilters({...filters, collegeType: 'Engineering'})}
            >
              <Filter className="mr-2 h-4 w-4" />
              Engineering
            </Button>
            <Button 
              variant="outline" 
              className="bg-white/10 border-white/20 text-white"
              onClick={() => setFilters({...filters, collegeType: 'Medical'})}
            >
              Medical
            </Button>
            <Button 
              variant="outline" 
              className="bg-white/10 border-white/20 text-white"
              onClick={() => setFilters({...filters, collegeType: 'Arts and Science'})}
            >
              Arts & Science
            </Button>
            <Button 
              variant="outline" 
              className="bg-white/10 border-white/20 text-white"
              onClick={() => setFilters({state: "", collegeType: "", institutionType: ""})}
            >
              Clear Filters
            </Button>
          </div>
        </div>
      </section>

      {/* Colleges List */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">
              {searchQuery ? `Search Results for "${searchQuery}"` : "Popular Colleges"}
              <span className="text-lg font-normal text-muted-foreground ml-2">
                ({colleges.length} colleges)
              </span>
            </h2>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              More Filters
            </Button>
          </div>

          {colleges.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🏫</div>
              <h3 className="text-xl font-semibold mb-2">No colleges found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search terms or filters
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {colleges.map((college) => (
                <Card key={college.id} className="shadow-card hover:shadow-elegant transition-shadow duration-300">
                  <CardHeader>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div>
                        <CardTitle className="text-2xl text-primary">{college.name}</CardTitle>
                        <div className="flex items-center gap-2 text-muted-foreground mt-2">
                          <MapPin className="h-4 w-4" />
                          <span>{college.city}, {college.state}</span>
                        </div>
                        {college.establishment_year && (
                          <div className="text-sm text-muted-foreground">
                            Established: {college.establishment_year}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex flex-col items-end gap-2">
                        <div className="flex items-center gap-1">
                          <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                          <span className="font-semibold">{getAverageRating(college.college_feedback)}</span>
                          <span className="text-sm text-muted-foreground">
                            ({getRatingCount(college)} reviews)
                          </span>
                        </div>
                        <Button variant="hero" size="sm">
                          View Details
                        </Button>
                      </div>
                    </div>
                    
                    {/* Categories */}
                    <div className="flex flex-wrap gap-2 mt-4">
                      {college.college_type && (
                        <Badge variant="secondary">{college.college_type}</Badge>
                      )}
                      {college.institution_type && (
                        <Badge variant="outline">{college.institution_type}</Badge>
                      )}
                      {college.nirf_ranking && (
                        <Badge variant="default">NIRF #{college.nirf_ranking}</Badge>
                      )}
                    </div>
                    
                    {/* Description */}
                    {college.description && (
                      <p className="text-muted-foreground mt-2 text-sm line-clamp-2">
                        {college.description}
                      </p>
                    )}
                    
                    {/* Facilities */}
                    {college.facilities && college.facilities.length > 0 && (
                      <div className="mt-4">
                        <h5 className="text-sm font-medium mb-2">Facilities:</h5>
                        <div className="flex flex-wrap gap-1">
                          {college.facilities.slice(0, 4).map((facility: string, index: number) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {facility}
                            </Badge>
                          ))}
                          {college.facilities.length > 4 && (
                            <Badge variant="outline" className="text-xs">
                              +{college.facilities.length - 4} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}
                  </CardHeader>
                  
                  <CardContent>
                    {college.college_feedback && college.college_feedback.length > 0 ? (
                      <>
                        <h4 className="font-semibold mb-4">Recent Feedback</h4>
                        <div className="space-y-4">
                          {college.college_feedback.slice(0, 2).map((feedback: any) => (
                            <div key={feedback.id} className="border-l-4 border-primary pl-4 py-2">
                              <p className="text-foreground mb-2">{feedback.review_text}</p>
                              <div className="flex items-center justify-between flex-wrap gap-2">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <span>{feedback.is_anonymous ? "Anonymous" : "Verified Student"}</span>
                                  {!feedback.is_anonymous && (
                                    <Badge variant="default" className="text-xs">Verified</Badge>
                                  )}
                                  {feedback.course && (
                                    <>
                                      <span>•</span>
                                      <span>{feedback.course}</span>
                                    </>
                                  )}
                                </div>
                                
                                <div className="flex items-center gap-4">
                                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                    <span>{feedback.overall_rating}/5</span>
                                  </div>
                                  <FeedbackRating
                                    onRate={(rating) => handleFeedbackRate(feedback.id, rating)}
                                    currentRating={feedbackRatings[feedback.id]}
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                          {college.college_feedback.length > 2 && (
                            <div className="text-center">
                              <Button variant="outline" size="sm">
                                View all {college.college_feedback.length} reviews
                              </Button>
                            </div>
                          )}
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-6">
                        <div className="text-4xl mb-2">💭</div>
                        <p className="text-muted-foreground mb-3">No reviews yet</p>
                        <Button variant="outline" size="sm">
                          Be the first to review
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}