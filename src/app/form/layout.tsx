import { ReactNode } from "react";

interface LayoutProps {
    children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
    return <div className="bg-gray-800 p-4 rounded">{children}</div>;
}
