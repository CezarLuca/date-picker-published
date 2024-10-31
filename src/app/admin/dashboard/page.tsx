// src/app/admin/dashboard/page.tsx
"use client";

import withAuth from "@/app/utils/withAuth";
import Calendar from "@/app/components/Calendar";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabaseClient";

const AdminDashboard = () => {
    const router = useRouter();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push("/admin/login");
    };

    const goHome = async () => {
        await supabase.auth.signOut();
        router.push("/");
    };

    return (
        <div>
            <div className="flex items-center justify-center bg-gray-800 text-gray-200 mb-4 p-4 relative">
                <button
                    onClick={goHome}
                    className="absolute left-4 bg-gray-600 text-gray-200 p-2 rounded"
                >
                    Home
                </button>
                <h1 className="text-xl">Admin Dashboard</h1>
                <button
                    onClick={handleLogout}
                    className="absolute right-4 bg-gray-600 text-gray-200 p-2 rounded"
                >
                    Logout
                </button>
            </div>
            <Calendar />
        </div>
    );
};

export default withAuth(AdminDashboard);
