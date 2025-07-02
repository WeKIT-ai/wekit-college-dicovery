import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Quote } from "lucide-react";

export function SuccessStories() {
  const stories = [
    {
      name: "Arjun Sharma",
      college: "IIT Delhi",
      course: "Computer Science",
      rating: 5,
      story: "WeKIT's mentoring sessions were a game-changer! My mentor from IIT helped me crack JEE Advanced with strategies I never found in any book. The college comparison tool saved me months of research.",
      improvement: "JEE Rank: 247 → 89",
      tag: "🏆 IIT Success"
    },
    {
      name: "Priya Patel", 
      college: "AIIMS Delhi",
      course: "MBBS",
      rating: 5,
      story: "The NEET preparation course was exactly what I needed. The biology section by AIIMS graduates was incredible. Plus, talking to current medical students gave me confidence about my choice.",
      improvement: "NEET Score: 520 → 650",
      tag: "🩺 AIIMS Achiever"
    },
    {
      name: "Rohit Kumar",
      college: "BITS Pilani",
      course: "Mechanical Engineering", 
      rating: 5,
      story: "I was confused between 15+ colleges until I used WeKIT. The honest reviews from seniors and 1-on-1 guidance helped me pick BITS. Best decision ever! The placement prep course was a bonus.",
      improvement: "Package: ₹8L → ₹15L",
      tag: "💼 Placement Pro"
    }
  ];

  return (
    <section className="py-16 px-4 bg-gradient-card">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-green-100 text-green-700">⭐ SUCCESS STORIES</Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            10,000+ Students Achieved Their Dreams
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            See how WeKIT's mentoring and courses transformed their college journey
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stories.map((story, index) => (
            <Card key={index} className="shadow-elegant hover:shadow-glow transition-all duration-300 hover:scale-105 relative overflow-hidden">
              <div className="absolute top-4 right-4">
                <Quote className="h-8 w-8 text-primary/20" />
              </div>
              
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <Badge variant="secondary" className="text-xs">
                    {story.tag}
                  </Badge>
                  <div className="flex items-center gap-1">
                    {[...Array(story.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>

                <p className="text-foreground mb-4 text-sm leading-relaxed italic">
                  "{story.story}"
                </p>

                <div className="border-t pt-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="font-semibold text-primary">{story.name}</h4>
                      <p className="text-xs text-muted-foreground">{story.course}</p>
                      <p className="text-xs text-muted-foreground font-medium">{story.college}</p>
                    </div>
                  </div>
                  
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-3">
                    <p className="text-xs font-semibold text-green-700">
                      🎯 Improvement: {story.improvement}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">
            Join thousands of successful students who trusted WeKIT for their college journey
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 bg-green-500 rounded-full"></div>
              <span>95% Success Rate</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
              <span>4.9/5 Rating</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 bg-purple-500 rounded-full"></div>
              <span>10,000+ Happy Students</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}