"use client";

import Calendar from "@/components/Calendar";
import { MaxWidthWrapper } from "@/components/MaxWidthWrapper";
import { useAdmin } from "@/contexts/AdminContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
    const { isAdmin } = useAdmin();
    const router = useRouter();

    useEffect(() => {
        if (isAdmin) {
            router.push("/admin/dashboard");
        }
    }, [isAdmin, router]);
    return (
        <section>
            <MaxWidthWrapper className="text-center">
                <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-2 pb-20 gap-4 sm:p-2 font-[family-name:var(--font-geist-sans)]">
                    <main className="flex flex-col gap-2 row-start-2 items-center sm:items-start">
                        <Calendar />
                    </main>
                </div>
            </MaxWidthWrapper>
        </section>
    );
}
