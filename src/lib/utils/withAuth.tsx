"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/utils/supabaseClient";

// const withAuth = (WrappedComponent: React.FC) => {
const withAuth = <P extends object>(
    WrappedComponent: React.ComponentType<P>
) => {
    const AuthenticatedComponent: React.FC<P> = (props) => {
        const router = useRouter();

        useEffect(() => {
            const checkUser = async () => {
                const { data } = await supabase.auth.getSession();
                if (!data.session) {
                    router.push("/admin/login");
                }
            };

            checkUser();
        }, [router]);

        return <WrappedComponent {...props} />;
    };

    return AuthenticatedComponent;
};

export default withAuth;
