"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { z } from "zod";
import Captcha, { CaptchaData } from "./Captcha";

const Form: React.FC<{ formData: { date: string } }> = ({ formData }) => {
    const router = useRouter();
    const [date, setDate] = useState(formData.date || "");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [description, setDescription] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [captchaData, setCaptchaData] = useState<CaptchaData | null>(null); // New state for captcha data
    const [isVerified, setIsVerified] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const formSchema = z.object({
        date: z.string(),
        name: z
            .string()
            .min(1, { message: "Name is required" })
            .max(99, { message: "Name is too long" })
            .refine((val) => val.trim().split(/\s+/).length >= 2, {
                message: "Name must have at least two words",
            })
            .refine((val) => !/[&\\|^<>]/.test(val), {
                message: "Name contains invalid special characters",
            }),
        email: z.string().email({ message: "Invalid email address" }),
        description: z
            .string()
            .min(1, { message: "Description is required" })
            .max(999, { message: "Description is too long" })
            .refine((val) => !/[&\\|^<>]/.test(val), {
                message: "Description contains invalid special characters",
            }),
        captchaData: z
            .object({
                selectedEncryptedId: z.number(),
                questionEncryptedId: z.number(),
            })
            .nullable()
            .refine((data) => data !== null, {
                message: "Captcha verification is required",
            }),
    });

    useEffect(() => {
        if (formData.date) {
            const [year, month, day] = formData.date.split("-");
            const formattedMonth = month.padStart(2, "0");
            const formattedDay = day.padStart(2, "0");
            const formattedDate = `${year}-${formattedMonth}-${formattedDay}`;
            setDate(formattedDate);
        }
    }, [formData.date]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setIsSubmitting(true);

        if (!isVerified || !captchaData) {
            setError("Please complete the captcha verification");
            setIsSubmitting(false);
            return;
        }

        try {
            // Validate form data using Zod
            const formData = formSchema.parse({
                date,
                name,
                email,
                description,
                captchaData,
            });

            const response = await fetch("/api/submit-form", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            if (response.ok) {
                setSuccess("Event scheduled successfully!");
                setName("");
                setEmail("");
                setDescription("");
                setDate("");
                setCaptchaData(null);
                setIsVerified(false); // Reset verification state
            } else {
                // setCaptchaData(null);
                // setIsVerified(false);
                setError(
                    result.error || "Something went wrong. Please try again."
                );
                setIsSubmitting(false); // Allow resubmission
            }
        } catch (error) {
            // setCaptchaData(null);
            // setIsVerified(false);
            if (error instanceof z.ZodError) {
                setError(error.errors.map((err) => err.message).join(", "));
            } else {
                setError("There was a problem submitting the form");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    // First, add a debug useEffect to track state changes
    useEffect(() => {
        console.log("Form State:", { isSubmitting, isVerified, error });
    }, [isSubmitting, isVerified, error]);

    // Add useEffect to reset error and submitting state when form fields change
    useEffect(() => {
        setError(""); // Clear error when user makes changes
        setIsSubmitting(false); // Re-enable button when user makes changes
    }, [name, email, description]); // Listen to form field changes

    const handleCaptchaSuccess = (data: CaptchaData) => {
        setCaptchaData(data);
        setIsVerified(true);
    };

    // console.log("captchaData", captchaData);

    return (
        <form className="bg-gray-800 p-4 rounded" onSubmit={handleSubmit}>
            <div className="mb-4">
                <label htmlFor="date" className="block text-gray-200">
                    Date
                </label>
                <input
                    type="text"
                    id="date"
                    disabled={true}
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full p-2 rounded bg-gray-700 text-gray-200"
                />
            </div>
            <div className="mb-4">
                <label htmlFor="name" className="block text-gray-200">
                    Name
                </label>
                <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-2 rounded bg-gray-700 text-gray-200"
                />
            </div>
            <div className="mb-4">
                <label htmlFor="email" className="block text-gray-200">
                    Email
                </label>
                <input
                    type="text"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2 rounded bg-gray-700 text-gray-200"
                />
            </div>
            <div className="mb-4">
                <label htmlFor="description" className="block text-gray-200">
                    Description
                </label>
                <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full p-2 rounded bg-gray-700 text-gray-200"
                />
            </div>

            <Captcha onSuccess={handleCaptchaSuccess} />

            <button
                type="submit"
                className={`w-full ${
                    isSubmitting || !isVerified
                        ? "bg-gray-400 text-gray-300 cursor-not-allowed"
                        : "bg-gray-500 text-gray-200 cursor-pointer"
                } hover:bg-gray-600  rounded p-2`}
                disabled={isSubmitting || !isVerified}
            >
                {isSubmitting ? (
                    <span className="flex items-center justify-center">
                        <svg
                            className="animate-spin h-5 w-5 mr-3"
                            viewBox="0 0 24 24"
                        >
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                                fill="none"
                            />
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                        </svg>
                        Scheduling...
                    </span>
                ) : (
                    "Schedule Event"
                )}
            </button>

            {error && (
                <div className="mt-4 bg-gray-600 border border-red-600 text-red-200 px-4 py-3 rounded">
                    <p>{error}</p>
                </div>
            )}

            {success && (
                <div className="mt-4 bg-gray-600 border border-green-600 text-green-200 px-4 py-3 rounded">
                    <p>{success}</p>
                    <button
                        onClick={() => router.push("/")}
                        className="mt-2 bg-gray-700 hover:bg-gray-800 text-gray-200 font-bold py-2 px-4 rounded"
                    >
                        &larr; Back to Home Page
                    </button>
                </div>
            )}
        </form>
    );
};

export default Form;
