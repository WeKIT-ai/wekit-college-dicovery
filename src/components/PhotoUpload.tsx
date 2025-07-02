import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Camera, Upload, X, Image } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface PhotoUploadProps {
  collegeId?: string;
  feedbackId?: string;
  onPhotosUploaded?: (photoUrls: string[]) => void;
}

interface UploadedPhoto {
  file: File;
  preview: string;
  caption: string;
  type: string;
}

export function PhotoUpload({ collegeId, feedbackId, onPhotosUploaded }: PhotoUploadProps) {
  const [photos, setPhotos] = useState<UploadedPhoto[]>([]);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const photoTypes = [
    { value: "general", label: "General Campus" },
    { value: "hostel", label: "Hostel/Accommodation" },
    { value: "library", label: "Library" },
    { value: "sports", label: "Sports Facilities" },
    { value: "cafeteria", label: "Cafeteria/Food" },
    { value: "classroom", label: "Classroom/Labs" },
    { value: "events", label: "Events/Activities" }
  ];

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    files.forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = () => {
          setPhotos(prev => [...prev, {
            file,
            preview: reader.result as string,
            caption: "",
            type: "general"
          }]);
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const updatePhotoDetails = (index: number, field: 'caption' | 'type', value: string) => {
    setPhotos(prev => prev.map((photo, i) => 
      i === index ? { ...photo, [field]: value } : photo
    ));
  };

  const uploadPhotos = async () => {
    if (!user || !collegeId) {
      toast({
        title: "Error",
        description: "Please make sure you're logged in and have selected a college",
        variant: "destructive"
      });
      return;
    }

    setUploading(true);
    const uploadedUrls: string[] = [];

    try {
      for (const photo of photos) {
        // Upload to Supabase Storage
        const fileExt = photo.file.name.split('.').pop();
        const fileName = `${user.id}/${Date.now()}.${fileExt}`;
        
        const { data: storageData, error: storageError } = await supabase.storage
          .from('college-photos')
          .upload(fileName, photo.file);

        if (storageError) throw storageError;

        // Get public URL
        const { data: urlData } = supabase.storage
          .from('college-photos')
          .getPublicUrl(fileName);

        // Save photo metadata to database
        const { error: dbError } = await supabase
          .from('college_photos')
          .insert({
            college_id: collegeId,
            user_id: user.id,
            feedback_id: feedbackId,
            photo_url: urlData.publicUrl,
            caption: photo.caption,
            photo_type: photo.type
          });

        if (dbError) throw dbError;

        uploadedUrls.push(urlData.publicUrl);
      }

      toast({
        title: "Photos uploaded successfully!",
        description: `${photos.length} photo(s) uploaded. They will be reviewed before appearing publicly.`
      });

      setPhotos([]);
      onPhotosUploaded?.(uploadedUrls);

    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload photos",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card className="shadow-card">
      <CardContent className="p-6">
        <div className="space-y-6">
          <div className="text-center">
            <Camera className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Add Campus Photos</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Share photos to help other students visualize the campus environment
            </p>
            
            <Input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileSelect}
              className="hidden"
              id="photo-upload"
            />
            <Label htmlFor="photo-upload" asChild>
              <Button variant="outline" className="cursor-pointer">
                <Upload className="h-4 w-4 mr-2" />
                Select Photos
              </Button>
            </Label>
          </div>

          {photos.length > 0 && (
            <div className="space-y-4">
              <h4 className="font-medium">Selected Photos ({photos.length})</h4>
              {photos.map((photo, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start gap-4">
                    <div className="relative">
                      <img 
                        src={photo.preview} 
                        alt={`Preview ${index + 1}`}
                        className="w-20 h-20 object-cover rounded"
                      />
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute -top-2 -right-2 h-6 w-6"
                        onClick={() => removePhoto(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                    
                    <div className="flex-1 space-y-3">
                      <div>
                        <Label htmlFor={`caption-${index}`} className="text-sm">Caption (Optional)</Label>
                        <Input
                          id={`caption-${index}`}
                          placeholder="Describe this photo..."
                          value={photo.caption}
                          onChange={(e) => updatePhotoDetails(index, 'caption', e.target.value)}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor={`type-${index}`} className="text-sm">Photo Category</Label>
                        <Select 
                          value={photo.type} 
                          onValueChange={(value) => updatePhotoDetails(index, 'type', value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {photoTypes.map(type => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              <Button 
                onClick={uploadPhotos} 
                disabled={uploading || !collegeId}
                className="w-full"
                variant="hero"
              >
                {uploading ? (
                  "Uploading..."
                ) : (
                  <>
                    <Image className="h-4 w-4 mr-2" />
                    Upload {photos.length} Photo{photos.length !== 1 ? 's' : ''}
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}