"use client";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import Form from "../components/OldForm";

const FormPageWithoutSuspense: React.FC = () => {
    const searchParams = useSearchParams();
    const date = searchParams.get("date");
    const [formData, setFormData] = useState({ date: "" });

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
