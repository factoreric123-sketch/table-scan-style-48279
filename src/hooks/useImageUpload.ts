import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface UploadImageParams {
  file: File;
  bucket: "dish-images" | "hero-images";
  path: string;
  onProgress?: (progress: number) => void;
}

// Phase 6: Image upload with progress tracking
export const useImageUpload = () => {
  return useMutation({
    mutationFn: async ({ file, bucket, path, onProgress }: UploadImageParams): Promise<string> => {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = path || fileName;

      // If no progress callback, use standard upload
      if (!onProgress) {
        const { error: uploadError } = await supabase.storage
          .from(bucket)
          .upload(filePath, file, { upsert: true });

        if (uploadError) {
          throw uploadError;
        }

        const { data } = supabase.storage
          .from(bucket)
          .getPublicUrl(filePath);

        return data.publicUrl;
      }

      // Use XMLHttpRequest for progress tracking
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.upload.addEventListener('progress', (e) => {
          if (e.lengthComputable) {
            const percentComplete = Math.round((e.loaded / e.total) * 100);
            onProgress(percentComplete);
          }
        });

        xhr.addEventListener('load', () => {
          if (xhr.status === 200) {
            const { data } = supabase.storage
              .from(bucket)
              .getPublicUrl(filePath);
            resolve(data.publicUrl);
          } else {
            reject(new Error(`Upload failed with status ${xhr.status}`));
          }
        });

        xhr.addEventListener('error', () => {
          reject(new Error('Upload failed'));
        });

        xhr.open('POST', `${supabaseUrl}/storage/v1/object/${bucket}/${filePath}`);
        xhr.setRequestHeader('Authorization', `Bearer ${supabaseKey}`);
        xhr.setRequestHeader('x-upsert', 'true');
        xhr.send(file);
      });
    },
    onError: (error: any) => {
      console.error("Error uploading image:", error);
      toast.error(error.message || "Failed to upload image");
    },
  });
};
