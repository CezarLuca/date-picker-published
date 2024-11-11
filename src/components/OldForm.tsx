"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/utils/supabaseClient";

const OldForm: React.FC<{ formData: { date: string } }> = ({ formData }) => {
    const router = useRouter();
    const [date, setDate] = useState(formData.date || "");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [description, setDescription] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    console.log(formData);

    useEffect(() => {
        if (formData.date) {
            // const formattedDate = new Date(formData.date)
            //     .toISOString()
            //     .split("T")[0];
            // setDate(formattedDate);
            // console.log(formattedDate);

            // Split the date into components
            const [year, month, day] = formData.date.split("-");

            // Pad month and day with leading zeros if necessary
            const formattedMonth = month.padStart(2, "0");
            const formattedDay = day.padStart(2, "0");

            // Reconstruct the date string
            const formattedDate = `${year}-${formattedMonth}-${formattedDay}`;

            setDate(formattedDate);
            console.log(`Formatted Date: ${formattedDate}`);
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

        try {
            // const { data, error } = await supabase.from('events').insert([
            const { error } = await supabase.from("events").insert([
                {
                    date,
                    name,
                    email,
                    description,
                },
            ]);

            if (error) {
                setError("Something went wrong. Please try again.");
                console.error(error);
            } else {
                setSuccess("Event scheduled successfully!");
                setName("");
                setEmail("");
                setDescription("");
                setDate("");
            }
        } catch (error) {
            setError("Something went wrong. Please try again.");
            console.error(error);
        }
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
            <button
                type="submit"
                className="w-full bg-gray-600 hover:bg-gray-700 text-gray-200 rounded p-2"
            >
                Schedule Event{""}
            </button>
            {/* {error && <p className="text-red-500 mt-4">{error}</p>}
            {success && (
                <p className="text-green-500 mt-4">
                    {success}
                    <button onClick={() => router.push("/")}>
                        &larr; Back to Home Page
                    </button>
                </p>
            )} */}
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

export default OldForm;
