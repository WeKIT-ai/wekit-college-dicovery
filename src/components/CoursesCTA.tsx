import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Clock, Users, Star, Play, CheckCircle2, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

interface CoursesCTAProps {
  variant?: "carousel" | "grid" | "banner" | "compact";
  className?: string;
}

export function CoursesCTA({ variant = "grid", className = "" }: CoursesCTAProps) {
  const courses = [
    {
      title: "JEE Main Preparation Strategy",
      description: "Master physics, chemistry & math with proven techniques from IIT toppers",
      duration: "8 weeks",
      students: "2,547",
      rating: "4.8",
      price: "₹999",
      originalPrice: "₹2,999",
      tag: "🔥 BESTSELLER",
      features: ["Daily mock tests", "Doubt clearing", "Performance analysis"]
    },
    {
      title: "NEET Success Blueprint", 
      description: "Complete biology, physics & chemistry roadmap by AIIMS graduates",
      duration: "10 weeks",
      students: "1,832",
      rating: "4.9",
      price: "₹1,299",
      originalPrice: "₹3,499",
      tag: "⭐ TOP RATED",
      features: ["Live classes", "Study materials", "Mock tests"]
    },
    {
      title: "College Application Mastery",
      description: "Step-by-step guide to applications, essays, and interviews",
      duration: "4 weeks", 
      students: "3,421",
      rating: "4.7",
      price: "₹599",
      originalPrice: "₹1,999",
      tag: "💎 TRENDING",
      features: ["Essay templates", "Interview prep", "Application tracker"]
    }
  ];

  if (variant === "banner") {
    return (
      <section className={`py-12 px-4 bg-gradient-primary ${className}`}>
        <div className="container mx-auto">
          <div className="text-center text-white mb-8">
            <Badge className="mb-4 bg-white/20 text-white">📚 EXCLUSIVE COURSES</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ace Your Entrance Exams with Expert-Designed Courses
            </h2>
            <p className="text-lg text-white/90 max-w-2xl mx-auto">
              Learn from IIT/AIIMS toppers who've cracked the toughest exams. 
              <span className="font-semibold"> 90% of our students improve their scores by 40%+</span>
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {courses.map((course, index) => (
              <Card key={index} className="bg-white/95 backdrop-blur shadow-glow hover:scale-105 transition-all duration-300">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="secondary" className="text-xs">
                      {course.tag}
                    </Badge>
                    <div className="text-right">
                      <div className="text-lg font-bold text-primary">{course.price}</div>
                      <div className="text-xs text-muted-foreground line-through">{course.originalPrice}</div>
                    </div>
                  </div>
                  <CardTitle className="text-lg">{course.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">{course.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {course.duration}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {course.students} students
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      {course.rating}
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    {course.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs">
                        <CheckCircle2 className="h-3 w-3 text-green-500" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Button asChild className="w-full hover-scale">
                    <Link to="/auth">
                      <Play className="mr-2 h-4 w-4" />
                      Start Learning
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <Button asChild variant="secondary" size="lg" className="text-primary">
              <Link to="/courses">
                View All 50+ Courses
                <TrendingUp className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    );
  }

  if (variant === "compact") {
    return (
      <Card className={`shadow-elegant ${className}`}>
        <CardContent className="p-4">
          <div className="flex items-center gap-3 mb-3">
            <BookOpen className="h-6 w-6 text-primary" />
            <div>
              <h4 className="font-semibold">📚 Prep Courses Available</h4>
              <p className="text-xs text-muted-foreground">JEE, NEET, BITSAT & more</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2 text-xs mb-3">
            <div className="text-center">
              <div className="font-semibold text-primary">50+</div>
              <div className="text-muted-foreground">Courses</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-primary">15,000+</div>
              <div className="text-muted-foreground">Students</div>
            </div>
          </div>

          <Button asChild size="sm" className="w-full">
            <Link to="/courses">
              Browse Courses
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Default grid variant
  return (
    <section className={`py-16 px-4 ${className}`}>
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <Badge className="mb-4">🎓 EXPERT COURSES</Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Master Your Entrance Exams
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Comprehensive courses designed by toppers who've aced JEE, NEET, and other competitive exams
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {courses.map((course, index) => (
            <Card key={index} className="shadow-card hover:shadow-elegant transition-all duration-300 hover:scale-105">
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="secondary">{course.tag}</Badge>
                  <div className="text-right">
                    <div className="text-xl font-bold text-primary">{course.price}</div>
                    <div className="text-sm text-muted-foreground line-through">{course.originalPrice}</div>
                  </div>
                </div>
                <CardTitle>{course.title}</CardTitle>
                <p className="text-muted-foreground">{course.description}</p>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {course.duration}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {course.students}
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    {course.rating}
                  </div>
                </div>
                
                <Button asChild className="w-full hover-scale">
                  <Link to="/auth">
                    Enroll Now
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}