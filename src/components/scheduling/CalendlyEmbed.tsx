import { useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CalendlyEmbedProps {
  calendlyUrl: string;
  mentorName?: string;
  sessionType?: string;
  onEventScheduled?: (eventData: any) => void;
}

export function CalendlyEmbed({ 
  calendlyUrl, 
  mentorName, 
  sessionType,
  onEventScheduled 
}: CalendlyEmbedProps) {
  const embedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load Calendly embed script
    const script = document.createElement('script');
    script.src = 'https://assets.calendly.com/assets/external/widget.js';
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      if (window.Calendly && embedRef.current) {
        window.Calendly.initInlineWidget({
          url: calendlyUrl,
          parentElement: embedRef.current,
          prefill: {},
          utm: {
            utmCampaign: 'wekit-mentoring',
            utmSource: 'wekit-platform',
            utmMedium: 'scheduling'
          }
        });

        // Listen for Calendly events
        window.addEventListener('message', (e) => {
          if (e.data.event && e.data.event.indexOf('calendly') === 0) {
            if (e.data.event === 'calendly.event_scheduled' && onEventScheduled) {
              onEventScheduled(e.data.payload);
            }
          }
        });
      }
    };

    return () => {
      document.body.removeChild(script);
    };
  }, [calendlyUrl, onEventScheduled]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Schedule Session
            {mentorName && <span className="text-muted-foreground">with {mentorName}</span>}
          </div>
          <Button variant="outline" size="sm" asChild>
            <a href={calendlyUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4 mr-2" />
              Open in New Tab
            </a>
          </Button>
        </CardTitle>
        {sessionType && (
          <p className="text-sm text-muted-foreground">{sessionType}</p>
        )}
      </CardHeader>
      <CardContent>
        <div 
          ref={embedRef}
          className="calendly-inline-widget"
          style={{ minWidth: '320px', height: '700px' }}
        />
      </CardContent>
    </Card>
  );
}

// Type declaration for Calendly widget
declare global {
  interface Window {
    Calendly: any;
  }
}