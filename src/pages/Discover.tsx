import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FeedbackRating } from "@/components/FeedbackRating";
import { Search, MapPin, Star, Users, Briefcase } from "lucide-react";

export default function Discover() {
  const [searchQuery, setSearchQuery] = useState("");
  const [feedbackRatings, setFeedbackRatings] = useState<Record<string, "positive" | "neutral" | "negative">>({});

  const handleFeedbackRate = (feedbackId: string, rating: "positive" | "neutral" | "negative") => {
    setFeedbackRatings(prev => ({
      ...prev,
      [feedbackId]: rating
    }));
  };

  // Mock data - would come from API
  const colleges = [
    {
      id: "1",
      name: "Indian Institute of Technology Delhi",
      location: "New Delhi",
      rating: 4.5,
      categories: ["Engineering", "Technology", "Research"],
      students: "11,000+",
      placement: "98%",
      feedback: [
        {
          id: "f1",
          text: "Excellent faculty and research opportunities. The campus culture is vibrant and competitive.",
          author: "Anonymous",
          course: "Computer Science",
          verified: false,
          positiveRatings: 24,
          neutralRatings: 3,
          negativeRatings: 1
        },
        {
          id: "f2",
          text: "Great placement opportunities and industry connections. Highly recommend for engineering.",
          author: "Priya Sharma",
          course: "Electronics",
          verified: true,
          positiveRatings: 18,
          neutralRatings: 2,
          negativeRatings: 0
        }
      ]
    },
    {
      id: "2",
      name: "Delhi University",
      location: "New Delhi",
      rating: 4.2,
      categories: ["Liberal Arts", "Science", "Commerce"],
      students: "130,000+",
      placement: "85%",
      feedback: [
        {
          id: "f3",
          text: "Diverse courses and good social life. The campus is huge with lots of activities.",
          author: "Anonymous",
          course: "Economics",
          verified: false,
          positiveRatings: 15,
          neutralRatings: 5,
          negativeRatings: 2
        }
      ]
    }
  ];

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
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <Input
              type="text"
              placeholder="Search colleges, courses, cities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-14 text-lg bg-background/95 backdrop-blur border-0 shadow-elegant"
            />
          </div>
        </div>
      </section>

      {/* Colleges List */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Popular Colleges</h2>
            <Button variant="outline">View All Filters</Button>
          </div>

          <div className="space-y-8">
            {colleges.map((college) => (
              <Card key={college.id} className="shadow-card hover:shadow-elegant transition-shadow duration-300">
                <CardHeader>
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <CardTitle className="text-2xl text-primary">{college.name}</CardTitle>
                      <div className="flex items-center gap-2 text-muted-foreground mt-2">
                        <MapPin className="h-4 w-4" />
                        <span>{college.location}</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end gap-2">
                      <div className="flex items-center gap-1">
                        <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold">{college.rating}</span>
                      </div>
                      <Button variant="hero" size="sm">
                        View Details
                      </Button>
                    </div>
                  </div>
                  
                  {/* Categories */}
                  <div className="flex flex-wrap gap-2 mt-4">
                    {college.categories.map((category) => (
                      <Badge key={category} variant="secondary">
                        {category}
                      </Badge>
                    ))}
                  </div>
                  
                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 mt-4">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Users className="h-4 w-4 text-primary" />
                        <span className="font-semibold">{college.students}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">Students</span>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Briefcase className="h-4 w-4 text-primary" />
                        <span className="font-semibold">{college.placement}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">Placement</span>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Star className="h-4 w-4 text-primary" />
                        <span className="font-semibold">{college.rating}/5</span>
                      </div>
                      <span className="text-sm text-muted-foreground">Rating</span>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <h4 className="font-semibold mb-4">Recent Feedback</h4>
                  <div className="space-y-4">
                    {college.feedback.map((feedback) => (
                      <div key={feedback.id} className="border-l-4 border-primary pl-4 py-2">
                        <p className="text-foreground mb-2">{feedback.text}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>{feedback.author}</span>
                            {feedback.verified && (
                              <Badge variant="default" className="text-xs">Verified</Badge>
                            )}
                            <span>•</span>
                            <span>{feedback.course}</span>
                          </div>
                          
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <span>{feedback.positiveRatings + feedback.neutralRatings + feedback.negativeRatings} ratings</span>
                            </div>
                            <FeedbackRating
                              onRate={(rating) => handleFeedbackRate(feedback.id, rating)}
                              currentRating={feedbackRatings[feedback.id]}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}