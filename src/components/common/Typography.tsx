import { cn } from "@/utils";
import React, { ReactNode } from "react";

interface TypographyProps {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span";
  className?: string;
  children: ReactNode;
}

const Typography: React.FC<TypographyProps> = ({
  as: Component = "p",
  className,
  children,
}) => {
  const baseClasses = {
    h1: "text-2xl font-bold text-dark-blue",
    h2: "text-xl font-bold text-dark-blue",
    h3: "text-lg font-bold text-dark-blue",
    h4: "text-base font-bold text-dark-blue",
    h5: "text-sm font-bold text-dark-blue",
    h6: "text-xs font-bold text-dark-blue",
    p: "text-base text-gray-700 font-inter",
    span: "text-base text-gray-700 font-inter",
  };

  const componentClasses = baseClasses[Component] || "";

  return (
    <Component className={cn(componentClasses, className)}>
      {children}
    </Component>
  );
};

export default Typography;
