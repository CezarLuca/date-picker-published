"use client";

import { supabase } from "@/lib/utils/supabaseClient";
import {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from "react";

interface AdminContextType {
    isAdmin: boolean;
    setIsAdmin: (value: boolean) => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: ReactNode }) {
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const checkUser = async () => {
            const { data } = await supabase.auth.getSession();
            setIsAdmin(!!data?.session);
        };

        checkUser();

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange(() => {
            checkUser();
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    return (
        <AdminContext.Provider value={{ isAdmin, setIsAdmin }}>
            {children}
        </AdminContext.Provider>
    );
}

export function useAdmin() {
    const context = useContext(AdminContext);
    if (context === undefined) {
        throw new Error("useAdmin must be used within an AdminProvider");
    }
    return context;
}
