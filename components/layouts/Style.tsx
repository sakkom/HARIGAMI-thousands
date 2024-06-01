import React, { FC } from "react";

interface StyleProps {
  children: React.ReactNode;
  className?: string;
}

export const Center: FC<StyleProps> = ({ className = "", children }) => {
  return <div className={`flex justify-center ${className}`}>{children}</div>;
};
