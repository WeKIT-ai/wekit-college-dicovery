import { useState, useEffect } from "react";
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Search, Users, Building2, MessageCircle, BookOpen, ExternalLink, Star, MapPin } from "lucide-react";

interface SearchResult {
  id: string;
  title: string;
  description?: string;
  type: 'college' | 'forum' | 'page' | 'mentor' | 'wekit-content';
  url?: string;
  external?: boolean;
  meta?: string;
  rating?: number;
  location?: string;
}

interface SearchCommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SearchCommandPalette({ open, onOpenChange }: SearchCommandPaletteProps) {
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const pageResults: SearchResult[] = [
    {
      id: 'discover',
      title: 'Discover Colleges',
      description: 'Search and explore colleges with real feedback',
      type: 'page',
      url: '/discover',
      meta: 'Find your perfect college match'
    },
    {
      id: 'compare',
      title: 'Compare Colleges',
      description: 'Compare colleges side-by-side',
      type: 'page',
      url: '/compare',
      meta: 'Make informed decisions'
    },
    {
      id: 'community',
      title: 'Community Forums',
      description: 'Connect with students and alumni',
      type: 'page',
      url: '/community',
      meta: 'Join the discussion'
    },
    {
      id: 'profile',
      title: 'Your Profile',
      description: 'Manage your account and activity',
      type: 'page',
      url: '/profile',
      meta: 'Account settings'
    },
    {
      id: 'feedback',
      title: 'Rate College',
      description: 'Share your college experience',
      type: 'page',
      url: '/feedback',
      meta: 'Help other students'
    }
  ];

  const wekitContentResults: SearchResult[] = [
    {
      id: 'wekit-mentoring',
      title: 'WeKIT Mentoring Program',
      description: 'One-on-one mentoring with industry experts',
      type: 'wekit-content',
      url: 'https://www.wekitmentoring.com/',
      external: true,
      meta: 'Professional mentoring'
    },
    {
      id: 'wekit-students',
      title: 'Student Programs',
      description: 'Comprehensive programs for student development',
      type: 'wekit-content',
      url: 'https://www.wekitmentoring.com/students',
      external: true,
      meta: 'Student development'
    },
    {
      id: 'wekit-about',
      title: 'About WeKIT',
      description: 'Learn about our mission and vision',
      type: 'wekit-content',
      url: 'https://www.wekitmentoring.com/about',
      external: true,
      meta: 'Our story'
    },
    {
      id: 'wekit-courses',
      title: 'WeKIT Courses',
      description: 'Skill development and career preparation courses',
      type: 'wekit-content',
      url: 'https://www.wekitmentoring.com/courses',
      external: true,
      meta: 'Learn new skills'
    }
  ];

  const searchContent = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([...pageResults, ...wekitContentResults]);
      return;
    }

    setLoading(true);
    try {
      const results: SearchResult[] = [];

      // Search pages and WeKIT content
      const filteredPages = pageResults.filter(
        page => 
          page.title.toLowerCase().includes(query.toLowerCase()) ||
          page.description?.toLowerCase().includes(query.toLowerCase()) ||
          page.meta?.toLowerCase().includes(query.toLowerCase())
      );
      results.push(...filteredPages);

      const filteredWeKitContent = wekitContentResults.filter(
        content => 
          content.title.toLowerCase().includes(query.toLowerCase()) ||
          content.description?.toLowerCase().includes(query.toLowerCase()) ||
          content.meta?.toLowerCase().includes(query.toLowerCase())
      );
      results.push(...filteredWeKitContent);

      // Search colleges
      const { data: colleges, error: collegesError } = await supabase
        .from('colleges')
        .select('id, name, city, state, description, college_type, nirf_ranking')
        .or(`name.ilike.%${query}%,city.ilike.%${query}%,state.ilike.%${query}%,description.ilike.%${query}%`)
        .limit(5);

      if (!collegesError && colleges) {
        const collegeResults: SearchResult[] = colleges.map(college => ({
          id: college.id,
          title: college.name,
          description: college.description || `${college.college_type || 'College'} in ${college.city}, ${college.state}`,
          type: 'college',
          url: `/discover?college=${college.id}`,
          location: `${college.city}, ${college.state}`,
          meta: college.nirf_ranking ? `NIRF Rank #${college.nirf_ranking}` : college.college_type
        }));
        results.push(...collegeResults);
      }

      // Search forums
      const { data: forums, error: forumsError } = await supabase
        .from('forums')
        .select('id, title, description, category, course')
        .eq('is_active', true)
        .or(`title.ilike.%${query}%,description.ilike.%${query}%,course.ilike.%${query}%`)
        .limit(5);

      if (!forumsError && forums) {
        const forumResults: SearchResult[] = forums.map(forum => ({
          id: forum.id,
          title: forum.title,
          description: forum.description || `Discussion in ${forum.category.replace('-', ' ')}`,
          type: 'forum',
          url: `/community/forum/${forum.id}`,
          meta: forum.course || forum.category.replace('-', ' ')
        }));
        results.push(...forumResults);
      }

      // Search mentors (if available)
      const { data: mentors, error: mentorsError } = await supabase
        .from('mentor_profiles')
        .select('id, first_name, last_name, company, position, specialties, bio')
        .eq('is_active', true)
        .eq('is_verified', true)
        .or(`first_name.ilike.%${query}%,last_name.ilike.%${query}%,company.ilike.%${query}%,position.ilike.%${query}%,bio.ilike.%${query}%`)
        .limit(3);

      if (!mentorsError && mentors) {
        const mentorResults: SearchResult[] = mentors.map(mentor => ({
          id: mentor.id,
          title: `${mentor.first_name} ${mentor.last_name}`,
          description: mentor.bio || `${mentor.position || 'Professional'} at ${mentor.company || 'Company'}`,
          type: 'mentor',
          url: `/mentor-scheduling?mentor=${mentor.id}`,
          meta: mentor.specialties?.join(', ') || mentor.position
        }));
        results.push(...mentorResults);
      }

      setSearchResults(results);
    } catch (error: any) {
      console.error('Search error:', error);
      toast({
        title: "Search Error",
        description: "Failed to search content. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (result: SearchResult) => {
    if (result.external && result.url) {
      window.open(result.url, '_blank', 'noopener,noreferrer');
    } else if (result.url) {
      navigate(result.url);
    }
    onOpenChange(false);
  };

  const getIcon = (type: SearchResult['type']) => {
    switch (type) {
      case 'college':
        return Building2;
      case 'forum':
        return MessageCircle;
      case 'mentor':
        return Users;
      case 'wekit-content':
        return ExternalLink;
      default:
        return BookOpen;
    }
  };

  const getGroupTitle = (type: SearchResult['type']) => {
    switch (type) {
      case 'college':
        return 'Colleges';
      case 'forum':
        return 'Community Forums';
      case 'mentor':
        return 'Mentors';
      case 'wekit-content':
        return 'WeKIT Programs';
      default:
        return 'Pages';
    }
  };

  useEffect(() => {
    if (open) {
      // Show default results when opened
      setSearchResults([...pageResults, ...wekitContentResults]);
    }
  }, [open]);

  const groupedResults = searchResults.reduce((acc, result) => {
    if (!acc[result.type]) {
      acc[result.type] = [];
    }
    acc[result.type].push(result);
    return acc;
  }, {} as Record<string, SearchResult[]>);

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput 
        placeholder="Search colleges, forums, mentors, or WeKIT programs..." 
        onValueChange={searchContent}
      />
      <CommandList>
        <CommandEmpty>
          {loading ? (
            <div className="flex items-center justify-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              <span className="ml-2">Searching...</span>
            </div>
          ) : (
            "No results found. Try different keywords."
          )}
        </CommandEmpty>
        
        {Object.entries(groupedResults).map(([type, results]) => (
          <CommandGroup key={type} heading={getGroupTitle(type as SearchResult['type'])}>
            {results.map((result) => {
              const Icon = getIcon(result.type);
              return (
                <CommandItem
                  key={result.id}
                  value={`${result.title} ${result.description} ${result.meta}`}
                  onSelect={() => handleSelect(result)}
                  className="flex items-center gap-3 py-3"
                >
                  <Icon className="h-4 w-4 text-muted-foreground" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{result.title}</span>
                      {result.external && <ExternalLink className="h-3 w-3 text-muted-foreground" />}
                      {result.rating && (
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs">{result.rating}</span>
                        </div>
                      )}
                    </div>
                    {result.description && (
                      <p className="text-sm text-muted-foreground truncate">{result.description}</p>
                    )}
                    <div className="flex items-center gap-2 mt-1">
                      {result.location && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          <span>{result.location}</span>
                        </div>
                      )}
                      {result.meta && (
                        <span className="text-xs text-muted-foreground">{result.meta}</span>
                      )}
                    </div>
                  </div>
                </CommandItem>
              );
            })}
          </CommandGroup>
        ))}
      </CommandList>
    </CommandDialog>
  );
}