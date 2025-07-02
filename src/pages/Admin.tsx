import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Download, Database, Globe, AlertCircle, CheckCircle } from "lucide-react";

export default function Admin() {
  const [isLoading, setIsLoading] = useState(false);
  const [scrapingProgress, setScrapingProgress] = useState(0);
  const [lastResult, setLastResult] = useState<any>(null);
  const { toast } = useToast();

  const handleScrapeColleges = async (source: string) => {
    setIsLoading(true);
    setScrapingProgress(0);
    
    try {
      toast({
        title: "Starting college data scraping",
        description: `Fetching data from ${source.toUpperCase()}...`,
      });

      const { data, error } = await supabase.functions.invoke('scrape-colleges', {
        body: { source }
      });

      if (error) {
        throw error;
      }

      setLastResult(data);
      setScrapingProgress(100);
      
      toast({
        title: "Scraping completed successfully",
        description: data.message,
      });

    } catch (error: any) {
      console.error('Scraping error:', error);
      toast({
        title: "Scraping failed",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const checkDatabaseStats = async () => {
    try {
      const { count, error } = await supabase
        .from('colleges')
        .select('*', { count: 'exact', head: true });

      if (error) throw error;

      toast({
        title: "Database Statistics",
        description: `Total colleges in database: ${count || 0}`,
      });
    } catch (error: any) {
      toast({
        title: "Error checking database",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">College Database Admin</h1>
          <p className="text-muted-foreground text-lg">
            Manage and populate the Indian colleges database
          </p>
        </div>

        {/* Database Stats */}
        <Card className="mb-8 shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Database Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={checkDatabaseStats}
                variant="outline"
                className="flex items-center gap-2"
              >
                <AlertCircle className="h-4 w-4" />
                Check Database Stats
              </Button>
              
              {lastResult && (
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-muted-foreground">
                    Last operation: {lastResult.message}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Scraping Controls */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* NIRF Data Scraping */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                NIRF Rankings Data
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Scrape college data from NIRF (National Institutional Ranking Framework) including top-ranked institutions across India.
                </p>
                
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">Engineering Colleges</Badge>
                  <Badge variant="secondary">Medical Colleges</Badge>
                  <Badge variant="secondary">Universities</Badge>
                  <Badge variant="secondary">Rankings</Badge>
                </div>

                <Button 
                  onClick={() => handleScrapeColleges('nirf')}
                  disabled={isLoading}
                  className="w-full"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Scrape NIRF Data
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* UGC Data Scraping */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                UGC Recognized Colleges
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Fetch data from UGC (University Grants Commission) list of recognized colleges and universities.
                </p>
                
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">UGC Recognized</Badge>
                  <Badge variant="secondary">All States</Badge>
                  <Badge variant="secondary">Multiple Disciplines</Badge>
                </div>

                <Button 
                  onClick={() => handleScrapeColleges('ugc')}
                  disabled={isLoading}
                  variant="outline"
                  className="w-full"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Scrape UGC Data
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Progress Indicator */}
        {isLoading && (
          <Card className="mt-6 shadow-card">
            <CardHeader>
              <CardTitle>Scraping in Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Progress value={scrapingProgress} className="w-full" />
                <p className="text-sm text-muted-foreground">
                  Fetching and processing college data... This may take a few minutes.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Important Notes */}
        <Card className="mt-8 shadow-card border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="text-yellow-800">Important Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="text-sm text-yellow-700 space-y-2">
              <li>• The scraping process may take several minutes to complete</li>
              <li>• Data is processed in batches to avoid overwhelming the database</li>
              <li>• Duplicate entries are automatically handled</li>
              <li>• All scraped data includes source attribution</li>
              <li>• Regular updates are recommended to keep data current</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}