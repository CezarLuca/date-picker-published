"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import Form from "../../components/Form";
import { useAdmin } from "@/contexts/AdminContext";

const FormPageWithoutSuspense: React.FC = () => {
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
        <div className="bg-gray-800 p-4 rounded">
            <h1>Fill up the form to schedule an event</h1>
            <Form formData={formData} />
        </div>
    );
};

const FormPageWithSuspense: React.FC = () => (
    <Suspense fallback={<div>Loading...</div>}>
        <FormPageWithoutSuspense />
    </Suspense>
);

export default FormPageWithSuspense;
