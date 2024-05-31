import React from "react";

interface CenterProps {
  children: React.ReactNode;
  className?: string;
}

export const Center: React.FC<CenterProps> = ({ className = "", children }) => {
  return (
    <div className={`flex flex-col items-center ${className}`}>{children}</div>
  );
};
