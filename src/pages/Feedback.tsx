import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { CoinBalance } from "@/components/CoinBalance";
import { PhotoUpload } from "@/components/PhotoUpload";
import { Star, Eye, EyeOff, Award } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export default function Feedback() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [colleges, setColleges] = useState<any[]>([]);
  const [selectedCollegeId, setSelectedCollegeId] = useState("");
  const [feedbackId, setFeedbackId] = useState<string | null>(null);
  const [ratings, setRatings] = useState({
    academics: [4],
    campusLife: [4],
    facilities: [4],
    safety: [4],
    placements: [4]
  });

  const [formData, setFormData] = useState({
    college: "",
    course: "",
    graduationYear: "",
    overallExperience: "",
    academics: "",
    campusLife: "",
    placements: "",
    wouldRecommend: "",
    additionalComments: ""
  });

  useEffect(() => {
    fetchColleges();
  }, []);

  const fetchColleges = async () => {
    try {
      const { data, error } = await supabase
        .from('colleges')
        .select('id, name, city, state')
        .order('name');
      
      if (error) throw error;
      setColleges(data || []);
    } catch (error) {
      console.error('Error fetching colleges:', error);
    }
  };

  const coinsToEarn = isAnonymous ? 50 : 100; // More coins for verified feedback

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !selectedCollegeId) {
      toast({
        title: "Error",
        description: "Please login and select a college to submit feedback",
        variant: "destructive"
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('college_feedback')
        .insert({
          user_id: user.id,
          college_id: selectedCollegeId,
          overall_rating: Math.round((ratings.academics[0] + ratings.campusLife[0] + ratings.facilities[0] + ratings.safety[0] + ratings.placements[0]) / 5),
          academics_rating: ratings.academics[0],
          campus_life_rating: ratings.campusLife[0],
          facilities_rating: ratings.facilities[0],
          safety_rating: ratings.safety[0],
          placements_rating: ratings.placements[0],
          title: `Review for ${colleges.find(c => c.id === selectedCollegeId)?.name}`,
          review_text: formData.overallExperience,
          course: formData.course,
          graduation_year: formData.graduationYear,
          would_recommend: formData.wouldRecommend,
          is_anonymous: isAnonymous
        })
        .select()
        .single();

      if (error) throw error;
      
      setFeedbackId(data.id);
      
      toast({
        title: "Feedback Submitted!",
        description: `Thank you for sharing your experience. You earned ${coinsToEarn} WeKIT coins!`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to submit feedback",
        variant: "destructive"
      });
    }
  };

  const updateRating = (category: string, value: number[]) => {
    setRatings(prev => ({
      ...prev,
      [category]: value
    }));
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Share Your College Experience</h1>
          <p className="text-muted-foreground text-lg">
            Help future students make informed decisions with your honest feedback
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-muted-foreground">Step {currentStep} of 3</span>
            <CoinBalance balance={coinsToEarn} />
          </div>
          <div className="w-full bg-secondary rounded-full h-2">
            <div 
              className="bg-gradient-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 3) * 100}%` }}
            />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Basic Information
                  <Badge variant="secondary">Step 1</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Anonymous Toggle */}
                <div className="flex items-center justify-between p-4 bg-gradient-card rounded-lg border">
                  <div className="flex items-center gap-3">
                    {isAnonymous ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    <div>
                      <Label className="text-base font-medium">
                        {isAnonymous ? "Anonymous Feedback" : "Verified Feedback"}
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        {isAnonymous 
                          ? "Your identity will be hidden. Earn 50 coins." 
                          : "Show your name and profile. Earn 100 coins."
                        }
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={isAnonymous}
                    onCheckedChange={setIsAnonymous}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="college">College Name *</Label>
                    <Select value={selectedCollegeId} onValueChange={(value) => {
                      setSelectedCollegeId(value);
                      const college = colleges.find(c => c.id === value);
                      setFormData({...formData, college: college?.name || ""});
                    }}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your college" />
                      </SelectTrigger>
                      <SelectContent>
                        {colleges.map(college => (
                          <SelectItem key={college.id} value={college.id}>
                            {college.name} - {college.city}, {college.state}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="course">Course/Program *</Label>
                    <Input
                      id="course"
                      placeholder="e.g., Computer Science Engineering"
                      value={formData.course}
                      onChange={(e) => setFormData({...formData, course: e.target.value})}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="graduationYear">Graduation Year *</Label>
                    <Select value={formData.graduationYear} onValueChange={(value) => setFormData({...formData, graduationYear: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select year" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2024">2024</SelectItem>
                        <SelectItem value="2023">2023</SelectItem>
                        <SelectItem value="2022">2022</SelectItem>
                        <SelectItem value="2021">2021</SelectItem>
                        <SelectItem value="2020">2020</SelectItem>
                        <SelectItem value="older">Before 2020</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button 
                  type="button" 
                  onClick={() => setCurrentStep(2)} 
                  className="w-full" 
                  variant="hero"
                  disabled={!selectedCollegeId || !formData.course || !formData.graduationYear}
                >
                  Continue to Ratings
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Ratings */}
          {currentStep === 2 && (
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Rate Your Experience
                  <Badge variant="secondary">Step 2</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* Rating Categories */}
                {[
                  { key: "academics", label: "Academics & Teaching Quality", icon: "📚" },
                  { key: "campusLife", label: "Campus Life & Activities", icon: "🎭" },
                  { key: "facilities", label: "Facilities & Infrastructure", icon: "🏗️" },
                  { key: "safety", label: "Safety & Security", icon: "🛡️" },
                  { key: "placements", label: "Placements & Career Support", icon: "💼" }
                ].map((category) => (
                  <div key={category.key} className="space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{category.icon}</span>
                      <Label className="text-base font-medium">{category.label}</Label>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-muted-foreground w-8">1</span>
                      <Slider
                        value={ratings[category.key as keyof typeof ratings]}
                        onValueChange={(value) => updateRating(category.key, value)}
                        max={5}
                        min={1}
                        step={1}
                        className="flex-1"
                      />
                      <span className="text-sm text-muted-foreground w-8">5</span>
                      <div className="flex items-center gap-1 w-16">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold">{ratings[category.key as keyof typeof ratings][0]}</span>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="flex gap-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setCurrentStep(1)}
                    className="flex-1"
                  >
                    Back
                  </Button>
                  <Button 
                    type="button" 
                    onClick={() => setCurrentStep(3)} 
                    variant="hero"
                    className="flex-1"
                  >
                    Continue to Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Detailed Feedback */}
          {currentStep === 3 && (
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Share Your Story
                  <Badge variant="secondary">Step 3</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="overallExperience">Overall Experience *</Label>
                  <Textarea
                    id="overallExperience"
                    placeholder="Describe your overall college experience in 2-3 sentences..."
                    value={formData.overallExperience}
                    onChange={(e) => setFormData({...formData, overallExperience: e.target.value})}
                    required
                    className="min-h-[100px]"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="academics">Academic Experience</Label>
                    <Textarea
                      id="academics"
                      placeholder="Tell us about the faculty, curriculum, research opportunities..."
                      value={formData.academics}
                      onChange={(e) => setFormData({...formData, academics: e.target.value})}
                      className="min-h-[80px]"
                    />
                  </div>

                  <div>
                    <Label htmlFor="campusLife">Campus Life</Label>
                    <Textarea
                      id="campusLife"
                      placeholder="Clubs, events, social life, diversity..."
                      value={formData.campusLife}
                      onChange={(e) => setFormData({...formData, campusLife: e.target.value})}
                      className="min-h-[80px]"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="placements">Placement & Career Support</Label>
                  <Textarea
                    id="placements"
                    placeholder="Companies that visit, placement process, career guidance..."
                    value={formData.placements}
                    onChange={(e) => setFormData({...formData, placements: e.target.value})}
                    className="min-h-[80px]"
                  />
                </div>

                <div>
                  <Label htmlFor="wouldRecommend">Would you recommend this college? *</Label>
                  <Select value={formData.wouldRecommend} onValueChange={(value) => setFormData({...formData, wouldRecommend: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your recommendation" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="definitely">Definitely recommend</SelectItem>
                      <SelectItem value="probably">Probably recommend</SelectItem>
                      <SelectItem value="neutral">Neutral</SelectItem>
                      <SelectItem value="probably-not">Probably not recommend</SelectItem>
                      <SelectItem value="definitely-not">Definitely not recommend</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Photo Upload */}
                <PhotoUpload 
                  collegeId={selectedCollegeId}
                  feedbackId={feedbackId}
                  onPhotosUploaded={(urls) => {
                    toast({
                      title: "Photos uploaded!",
                      description: `${urls.length} photo(s) uploaded successfully`
                    });
                  }}
                />

                <div>
                  <Label htmlFor="additionalComments">Additional Comments</Label>
                  <Textarea
                    id="additionalComments"
                    placeholder="Anything else you'd like future students to know..."
                    value={formData.additionalComments}
                    onChange={(e) => setFormData({...formData, additionalComments: e.target.value})}
                    className="min-h-[80px]"
                  />
                </div>

                <div className="flex gap-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setCurrentStep(2)}
                    className="flex-1"
                  >
                    Back
                  </Button>
                  <Button 
                    type="submit" 
                    variant="hero"
                    className="flex-1"
                    disabled={!formData.overallExperience || !formData.wouldRecommend || !selectedCollegeId}
                  >
                    <Award className="h-4 w-4 mr-2" />
                    Submit & Earn {coinsToEarn} Coins
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </form>

        {/* Sample Feedback */}
        <Card className="mt-8 shadow-card">
          <CardHeader>
            <CardTitle className="text-lg">💡 Sample Feedback</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm">
              <div>
                <strong>Overall Experience:</strong> "My 4 years at IIT Delhi were transformative. The rigorous academics pushed me to excel, while the diverse student community broadened my perspectives."
              </div>
              <div>
                <strong>Academic Experience:</strong> "The faculty is world-class with most professors having industry experience. The research opportunities are abundant, especially in AI and robotics."
              </div>
              <div>
                <strong>Campus Life:</strong> "The campus has 50+ clubs covering everything from robotics to music. The annual technical fest Tryst and cultural fest Rendezvous are highlights."
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}