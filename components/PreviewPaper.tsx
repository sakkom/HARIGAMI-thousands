import React from "react";
import { UseFormRegister, UseFormWatch } from "react-hook-form";
import Paper from "@mui/material/Paper";
import { Typography } from "@material-tailwind/react";
import { useVanillaTilt } from "@/hooks/useVanillaTilt";
import { useImagePreview } from "@/hooks/useImagePreview";

interface PreviewPaperProps {
  register: UseFormRegister<any>;
  watch: UseFormWatch<any>;
}

export const PreviewPaper: React.FC<PreviewPaperProps> = ({
  register,
  watch,
}) => {
  const paperRef = useVanillaTilt();
  const imageUrl = useImagePreview(watch);

  return (
    <Paper ref={paperRef} className={`bg-white bg-opacity-10 aspect-square`}>
      {imageUrl ? (
        <img src={imageUrl} alt="Uploaded" className="max-w-full max-h-full" />
      ) : (
        <label className="w-full h-full flex justify-center items-center cursor-pointer">
          <Typography variant="h1" className="text-center">
            Click to upload file
          </Typography>
          <input type="file" {...register("image")} hidden />
        </label>
      )}
    </Paper>
  );
};
