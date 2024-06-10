import { useState, useEffect } from "react";
import { UseFormWatch } from "react-hook-form";

export const useImagePreview = (watch: UseFormWatch<any>) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const imageRef = watch("coverImage"); //note!

  useEffect(() => {
    if (imageRef && imageRef.length > 0) {
      const fileURL = URL.createObjectURL(imageRef[0]);
      setImageUrl(fileURL);

      return () => {
        URL.revokeObjectURL(fileURL);
      };
    } else {
      setImageUrl(null);
    }
  }, [imageRef]);

  return imageUrl;
};
