import { useState, useEffect } from "react";
import { UseFormWatch } from "react-hook-form";

const useImagePreview = (watch: UseFormWatch<any>) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const imageRef = watch("image");

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

export default useImagePreview;
