import React, { ReactNode } from "react";
import { cn } from "@/lib/utils/helpers";

interface MaxWidthWrapperProps {
    className?: string;
    children: ReactNode;
}

export const MaxWidthWrapper = ({
    className,
    children,
}: MaxWidthWrapperProps) => {
    return (
        <div className={cn("h-full mx-auto w-full max-w-screen-xl", className)}>
            {children}
        </div>
    );
};
