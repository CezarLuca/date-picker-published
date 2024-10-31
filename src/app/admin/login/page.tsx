// src/app/admin/login/page.tsx
"use client";

import { useState } from "react";
import { supabase } from "@/utils/supabaseClient";
import { useRouter } from "next/navigation";

const AdminLogin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setError("Invalid credentials. Please try again.");
        } else {
            router.push("/admin/dashboard");
        }
    };

    return (
        <form className="bg-gray-800 p-4 rounded" onSubmit={handleLogin}>
            <h1 className="text-gray-200 text-xl mb-4">Admin Login</h1>
            {error && <p className="text-red-500">{error}</p>}
            <div className="mb-4">
                <label htmlFor="email" className="block text-gray-200">
                    Email
                </label>
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2 rounded bg-gray-700 text-gray-200"
                />
            </div>
            <div className="mb-4">
                <label htmlFor="password" className="block text-gray-200">
                    Password
                </label>
                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-2 rounded bg-gray-700 text-gray-200"
                />
            </div>
            <button
                type="submit"
                className="w-full bg-gray-600 hover:bg-gray-700 text-gray-200 rounded p-2"
            >
                Login
            </button>
        </form>
    );
};

export default AdminLogin;
