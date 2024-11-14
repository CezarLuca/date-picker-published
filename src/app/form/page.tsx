"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import Form from "../../components/Form";
import { useAdmin } from "@/contexts/AdminContext";

function FormPageContent() {
    const searchParams = useSearchParams();
    const date = searchParams.get("date");
    const [formData, setFormData] = useState({ date: "" });
    const { isAdmin } = useAdmin();
    const router = useRouter();

    useEffect(() => {
        if (isAdmin) {
            router.push("/admin/dashboard");
        }
    }, [isAdmin, router]);

    useEffect(() => {
        if (date) {
            setFormData({ date });
        }
    }, [date]);

    return (
        <>
            <h1>Fill up the form to schedule an event</h1>
            <Form formData={formData} />
        </>
    );
}

export default function FormPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <FormPageContent />
        </Suspense>
    );
}
