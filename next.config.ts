import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    /* config options here */
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "izpcculeirjezmpfwdrd.supabase.co",
                port: "",
                pathname: "/storage/v1/object/public/captcha-images/**",
            },
        ],
    },
};

export default nextConfig;
