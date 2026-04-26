import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadPlayerImage } from "../../services/ImageService";
import { toast } from "react-toastify";
import { FaCloudUploadAlt } from "react-icons/fa";

interface ImageUploadProps {
  playerId: string;
  onUploadSuccess: () => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ playerId, onUploadSuccess }) => {
  const queryClient = useQueryClient();
  const [isUploading, setIsUploading] = useState(false);

  const uploadMutation = useMutation({
    mutationFn: (file: File) => uploadPlayerImage(playerId, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teams"] });
      toast.success("Image uploaded successfully!");
      setIsUploading(false);
      onUploadSuccess();
    },
    onError: (e) => {
      toast.error("Failed to upload image.");
      setIsUploading(false);
      console.error("Upload error:", e);
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.warn("File is too large (max 2MB)");
        return;
      }
      setIsUploading(true);
      uploadMutation.mutate(file);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <label
        className="p-1 bg-blue-500 hover:bg-blue-600 text-white rounded-full cursor-pointer transition-all shadow-md flex items-center justify-center avatar hover:scale-120 "
        title="Upload Team Logo"
      >
        {isUploading ? (
          <span className="loading loading-spinner loading-xs"></span>
        ) : (
          <FaCloudUploadAlt size={22} />
        )}

        <input
          type="file"
          className="hidden"
          accept="image/*"
          onChange={handleFileChange}
          disabled={isUploading}
        />
      </label>
    </div>
  );
};

export default ImageUpload;
