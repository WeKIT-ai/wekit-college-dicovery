import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Plus, X, Star, Users, Briefcase, MapPin, GraduationCap } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function Compare() {
  const { toast } = useToast();
  const [selectedColleges, setSelectedColleges] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [colleges, setColleges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchColleges();
  }, [searchQuery]);

  const fetchColleges = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('colleges')
        .select(`
          *,
          college_feedback (
            overall_rating,
            academics_rating,
            campus_life_rating,
            facilities_rating,
            safety_rating,
            placements_rating
          )
        `)
        .order('nirf_ranking', { ascending: true, nullsFirst: false });

      if (searchQuery) {
        query = query.or(`name.ilike.%${searchQuery}%,city.ilike.%${searchQuery}%,state.ilike.%${searchQuery}%`);
      }

      const { data, error } = await query.limit(20);
      if (error) throw error;
      
      // Transform data to match the expected format
      const transformedData = data?.map(college => ({
        id: college.id,
        name: college.name,
        location: `${college.city}, ${college.state}`,
        type: college.institution_type || 'Unknown',
        established: college.establishment_year || 'Unknown',
        rating: college.college_feedback?.length > 0 
          ? (college.college_feedback.reduce((sum: number, f: any) => sum + (f.overall_rating || 0), 0) / college.college_feedback.length).toFixed(1)
          : '0.0',
        students: college.student_capacity ? `${college.student_capacity}+` : 'N/A',
        placement: 'N/A', // Would need placement data
        fees: 'N/A', // Would need fee data
        rankings: { 
          nirf: college.nirf_ranking || 'Unranked', 
          qs: 'N/A' 
        },
        strengths: Array.isArray(college.departments) ? college.departments.slice(0, 4) : [],
        academics: college.college_feedback?.length > 0 
          ? (college.college_feedback.reduce((sum: number, f: any) => sum + (f.academics_rating || 0), 0) / college.college_feedback.length).toFixed(1)
          : '0.0',
        campusLife: college.college_feedback?.length > 0 
          ? (college.college_feedback.reduce((sum: number, f: any) => sum + (f.campus_life_rating || 0), 0) / college.college_feedback.length).toFixed(1)
          : '0.0',
        facilities: college.college_feedback?.length > 0 
          ? (college.college_feedback.reduce((sum: number, f: any) => sum + (f.facilities_rating || 0), 0) / college.college_feedback.length).toFixed(1)
          : '0.0',
        safety: college.college_feedback?.length > 0 
          ? (college.college_feedback.reduce((sum: number, f: any) => sum + (f.safety_rating || 0), 0) / college.college_feedback.length).toFixed(1)
          : '0.0',
        ...college
      })) || [];

      setColleges(transformedData);
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

  // Remove mock data section and update the existing logic
  const availableColleges = colleges.filter(college => 
    !selectedColleges.includes(college.id) &&
    college.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const compareColleges = selectedColleges.map(id => 
    colleges.find(college => college.id === id)
  ).filter(Boolean);

  const addCollege = (collegeId: string) => {
    if (selectedColleges.length < 3) {
      setSelectedColleges([...selectedColleges, collegeId]);
    }
  };

  const removeCollege = (collegeId: string) => {
    setSelectedColleges(selectedColleges.filter(id => id !== collegeId));
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
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="container mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Compare Colleges</h1>
          <p className="text-muted-foreground text-lg">
            Compare up to 3 colleges side by side on key parameters
          </p>
        </div>

        {/* Add College Section */}
        <Card className="mb-8 shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Add Colleges to Compare ({selectedColleges.length}/3)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="text"
                placeholder="Search colleges..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {availableColleges.slice(0, 6).map((college) => (
                <div key={college.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <h3 className="font-semibold">{college.name}</h3>
                  <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                    <MapPin className="h-3 w-3" />
                    {college.location}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm">{college.rating}</span>
                    </div>
                    <Badge variant="secondary" className="text-xs">{college.type}</Badge>
                  </div>
                  <Button 
                    size="sm" 
                    className="mt-3 w-full" 
                    onClick={() => addCollege(college.id)}
                    disabled={selectedColleges.length >= 3}
                  >
                    Add to Compare
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Comparison Table */}
        {compareColleges.length > 0 && (
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>College Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-4 px-2 font-semibold">Parameter</th>
                      {compareColleges.map((college) => (
                        <th key={college?.id} className="text-center py-4 px-2 min-w-[200px]">
                          <div className="flex flex-col items-center gap-2">
                            <h3 className="font-semibold text-primary">{college?.name}</h3>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeCollege(college?.id || "")}
                              className="text-destructive hover:text-destructive"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {/* Basic Info */}
                    <tr className="border-b">
                      <td className="py-3 px-2 font-medium">Location</td>
                      {compareColleges.map((college) => (
                        <td key={college?.id} className="py-3 px-2 text-center">
                          {college?.location}
                        </td>
                      ))}
                    </tr>
                    
                    <tr className="border-b">
                      <td className="py-3 px-2 font-medium">Established</td>
                      {compareColleges.map((college) => (
                        <td key={college?.id} className="py-3 px-2 text-center">
                          {college?.established}
                        </td>
                      ))}
                    </tr>
                    
                    <tr className="border-b">
                      <td className="py-3 px-2 font-medium">Overall Rating</td>
                      {compareColleges.map((college) => (
                        <td key={college?.id} className="py-3 px-2 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-semibold">{college?.rating}</span>
                          </div>
                        </td>
                      ))}
                    </tr>
                    
                    {/* Academic Metrics */}
                    <tr className="border-b">
                      <td className="py-3 px-2 font-medium">Students</td>
                      {compareColleges.map((college) => (
                        <td key={college?.id} className="py-3 px-2 text-center">
                          {college?.students}
                        </td>
                      ))}
                    </tr>
                    
                    <tr className="border-b">
                      <td className="py-3 px-2 font-medium">Placement Rate</td>
                      {compareColleges.map((college) => (
                        <td key={college?.id} className="py-3 px-2 text-center">
                          <Badge variant="default">{college?.placement}</Badge>
                        </td>
                      ))}
                    </tr>
                    
                    <tr className="border-b">
                      <td className="py-3 px-2 font-medium">Annual Fees</td>
                      {compareColleges.map((college) => (
                        <td key={college?.id} className="py-3 px-2 text-center">
                          {college?.fees}
                        </td>
                      ))}
                    </tr>
                    
                    {/* Rankings */}
                    <tr className="border-b">
                      <td className="py-3 px-2 font-medium">NIRF Ranking</td>
                      {compareColleges.map((college) => (
                        <td key={college?.id} className="py-3 px-2 text-center">
                          #{college?.rankings.nirf}
                        </td>
                      ))}
                    </tr>
                    
                    <tr className="border-b">
                      <td className="py-3 px-2 font-medium">QS World Ranking</td>
                      {compareColleges.map((college) => (
                        <td key={college?.id} className="py-3 px-2 text-center">
                          #{college?.rankings.qs}
                        </td>
                      ))}
                    </tr>
                    
                    {/* Detailed Ratings */}
                    <tr className="border-b">
                      <td className="py-3 px-2 font-medium">Academics</td>
                      {compareColleges.map((college) => (
                        <td key={college?.id} className="py-3 px-2 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span>{college?.academics}</span>
                          </div>
                        </td>
                      ))}
                    </tr>
                    
                    <tr className="border-b">
                      <td className="py-3 px-2 font-medium">Campus Life</td>
                      {compareColleges.map((college) => (
                        <td key={college?.id} className="py-3 px-2 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span>{college?.campusLife}</span>
                          </div>
                        </td>
                      ))}
                    </tr>
                    
                    <tr className="border-b">
                      <td className="py-3 px-2 font-medium">Facilities</td>
                      {compareColleges.map((college) => (
                        <td key={college?.id} className="py-3 px-2 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span>{college?.facilities}</span>
                          </div>
                        </td>
                      ))}
                    </tr>
                    
                    <tr className="border-b">
                      <td className="py-3 px-2 font-medium">Safety</td>
                      {compareColleges.map((college) => (
                        <td key={college?.id} className="py-3 px-2 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span>{college?.safety}</span>
                          </div>
                        </td>
                      ))}
                    </tr>
                    
                    {/* Strengths */}
                    <tr>
                      <td className="py-3 px-2 font-medium">Key Strengths</td>
                      {compareColleges.map((college) => (
                        <td key={college?.id} className="py-3 px-2">
                          <div className="flex flex-wrap gap-1 justify-center">
                            {college?.strengths.map((strength) => (
                              <Badge key={strength} variant="secondary" className="text-xs">
                                {strength}
                              </Badge>
                            ))}
                          </div>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {selectedColleges.length === 0 && (
          <div className="text-center py-12">
            <GraduationCap className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No colleges selected</h3>
            <p className="text-muted-foreground">
              Add colleges from the search above to start comparing
            </p>
          </div>
        )}
      </div>
    </div>
  );
}