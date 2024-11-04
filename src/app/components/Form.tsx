"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Captcha, { CaptchaData } from "./Captcha";

// interface CaptchaData {
//     selectedKeyword: string;
//     question: string;
// }

const Form: React.FC<{ formData: { date: string } }> = ({ formData }) => {
    const router = useRouter();
    const [date, setDate] = useState(formData.date || "");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [description, setDescription] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [captchaData, setCaptchaData] = useState<CaptchaData | null>(null); // New state for captcha data
    // console.log(formData);

    useEffect(() => {
        if (formData.date) {
            const [year, month, day] = formData.date.split("-");
            const formattedMonth = month.padStart(2, "0");
            const formattedDay = day.padStart(2, "0");
            const formattedDate = `${year}-${formattedMonth}-${formattedDay}`;
            setDate(formattedDate);
            // console.log(`Formatted Date: ${formattedDate}`);
        }
    }, [formData.date]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!name || !email || !description) {
            setError("Please fill in all fields");
            return;
        }

        if (!captchaData) {
            setError("Please complete the captcha");
            return;
        }

        try {
            const response = await fetch("/api/submit-form", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    date,
                    name,
                    email,
                    description,
                    captchaData,
                }),
            });

            const result = await response.json();

            if (response.ok) {
                setSuccess("Event scheduled successfully!");
                setName("");
                setEmail("");
                setDescription("");
                setDate("");
                setCaptchaData(null);
            } else {
                setError(
                    result.error || "Something went wrong. Please try again."
                );
            }
        } catch (error) {
            setError("An unexpected error occurred.");
            console.error(error);
        }
    };

    const handleCaptchaSuccess = (data: CaptchaData) => {
        setCaptchaData(data);
    };

    return (
        <form className="bg-gray-800 p-4 rounded" onSubmit={handleSubmit}>
            <div className="mb-4">
                <label htmlFor="date" className="block text-gray-200">
                    Date
                </label>
                <input
                    type="date"
                    id="date"
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
                    type="email"
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
                className="w-full bg-gray-600 hover:bg-gray-700 text-gray-200 rounded p-2"
            >
                Schedule Event{""}
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
