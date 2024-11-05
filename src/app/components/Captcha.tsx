"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

interface CaptchaImage {
    id: number;
    image_url: string;
    keyword: string;
}
export interface CaptchaData {
    selectedKeyword: string;
    question: string;
}

interface CaptchaProps {
    onSuccess: (data: CaptchaData) => void;
}

// const Captcha: React.FC<{ onSuccess: () => void }> = ({
//     onSuccess,
// }) => {
const Captcha: React.FC<CaptchaProps> = ({ onSuccess }) => {
    const [images, setImages] = useState<CaptchaImage[]>([]);
    const [question, setQuestion] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isVerified, setIsVerified] = useState<boolean>(false);

    useEffect(() => {
        // const fetchCaptcha = async () => {
        //     const res = await fetch("/api/captcha");
        //     const data = await res.json();
        //     setImages(data.images);
        //     setQuestion(data.question);
        // };
        fetchCaptcha();
    }, []);

    const fetchCaptcha = async () => {
        try {
            const res = await fetch("/api/captcha");
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            const data = await res.json();
            if (!data.images || !data.question) {
                throw new Error("Invalid response format");
            }
            setImages(data.images);
            setQuestion(data.question);
            setError("");
        } catch (err) {
            setError("Failed to load captcha images. Please try again.");
            console.error("Fetch error:", err);
        }
    };

    // const handleImageClick = async (keyword: string) => {
    //     const response = await fetch("/api/captcha", {
    //         method: "POST",
    //         headers: { "Content-Type": "application/json" },
    //         body: JSON.stringify({ selectedKeyword: keyword, question }),
    //     });

    //     const data = await response.json();

    //     if (data.success) {
    //         setError("");
    //         onSuccess({ selectedKeyword: keyword, question });
    //     } else {
    //         setError(`Incorrect selection. Please try again: ${data.error}`);
    //         refreshCaptcha();
    //     }
    // };

    // const refreshCaptcha = async () => {
    //     const res = await fetch("/api/captcha");
    //     const data = await res.json();
    //     setImages(data.images);
    //     setQuestion(data.question);
    // };

    const handleImageClick = async (keyword: string) => {
        try {
            setIsLoading(true);
            setError("");

            const response = await fetch("/api/captcha", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    selectedKeyword: keyword,
                    question,
                }),
            });

            // if (!response.ok) {
            //     await fetchCaptcha();
            //     throw new Error(`HTTP error! status: ${response.status}`);
            // }

            const data = await response.json();

            if (data.success) {
                setIsVerified(true);
                onSuccess({ selectedKeyword: keyword, question });
            } else {
                setError("Incorrect selection. Please try again.");
                await fetchCaptcha();
            }
        } catch (err) {
            setError("An error occurred. Please try again.");
            console.error("Validation error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    if (isVerified) {
        return (
            <div className="flex flex-col items-center justify-center p-4 bg-gray-700 rounded">
                <div className="text-green-400 mb-2">
                    <svg
                        className="w-12 h-12 mx-auto"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                        />
                    </svg>
                </div>
                <p className="text-green-400 text-center font-semibold">
                    Captcha verification successful!
                </p>
            </div>
        );
    }

    return (
        <div>
            <h3>
                Click on the image that best matches the keyword: {question}
            </h3>
            <div className="flex gap-10">
                {images.map((image) => (
                    <button
                        key={image.id}
                        onClick={() => handleImageClick(image.keyword)}
                        disabled={isLoading}
                        className="relative"
                    >
                        <Image
                            quality={25}
                            priority={true}
                            width={100}
                            height={100}
                            className={`${isLoading ? "opacity-50" : ""}`}
                            src={image.image_url}
                            alt={"captcha image"}
                        />
                        {isLoading && (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="animate-spin">⌛</span>
                            </div>
                        )}
                    </button>
                ))}
            </div>
            {error && <p className="text-red-500 mt-2">{error}</p>}
            <button
                onClick={fetchCaptcha}
                disabled={isLoading}
                className="mt-4 mb-4 px-4 py-2 bg-gray-600 rounded"
            >
                Refresh
            </button>
        </div>
    );
};

export default Captcha;
