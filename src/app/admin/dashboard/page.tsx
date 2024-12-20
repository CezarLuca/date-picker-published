"use client";

// import withAuth from "@/lib/utils/withAuth";
import Calendar from "@/components/Calendar";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/utils/supabaseClient";
import { UpcomingEvents } from "@/components/UpcomingEvents";
import { useAdmin } from "@/contexts/AdminContext";

const AdminDashboard = () => {
    const router = useRouter();
    const { isAdmin, setIsAdmin } = useAdmin();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        setIsAdmin(false);
        router.push("/admin/login");
    };

    const goHome = async () => {
        await supabase.auth.signOut();
        router.push("/");
        setIsAdmin(false);
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
                    {isAdmin ? "Logout" : "Login"}
                </button>
            </div>
            <Calendar />
            <UpcomingEvents />
        </div>
    );
};

export default AdminDashboard;
