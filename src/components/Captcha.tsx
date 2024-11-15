"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import LoadingImagePlaceholder from "./LoadingImagePlaceholder";

interface CaptchaImage {
    encryptedId: number;
    image_url: string;
}
export interface CaptchaData {
    selectedEncryptedId: number;
    questionEncryptedId: number;
}
interface CaptchaProps {
    onSuccess: (data: CaptchaData) => void;
}

const Captcha: React.FC<CaptchaProps> = ({ onSuccess }) => {
    const [images, setImages] = useState<CaptchaImage[]>([]);
    const [question, setQuestion] = useState<string>("");
    const [questionId, setQuestionId] = useState<number | null>(null);
    const [error, setError] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isLoadingImages, setIsLoadingImages] = useState<boolean>(false);
    const [isVerified, setIsVerified] = useState<boolean>(false);

    useEffect(() => {
        fetchCaptcha();
    }, []);

    const fetchCaptcha = async () => {
        setIsLoadingImages(true);
        try {
            const res = await fetch("/api/captcha");
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            const data = await res.json();
            if (!data.images || !data.question || !data.questionId) {
                throw new Error("Invalid response format");
            }
            setIsLoadingImages(false);
            setIsVerified(false);
            setImages(data.images);
            setQuestion(data.question);
            setQuestionId(data.questionId);
            setError("");
        } catch (err) {
            setIsLoadingImages(false);
            setIsVerified(false);
            setError("Failed to load captcha images. Please try again.");
            console.error("Fetch error:", err);
        }
    };

    const handleImageClick = async (imageId: number) => {
        try {
            setIsVerified(false);
            setIsLoading(true);
            setError("");

            const response = await fetch("/api/captcha", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    selectedEncryptedId: imageId,
                    questionEncryptedId: questionId,
                }),
            });

            const data = await response.json();

            if (data.success) {
                setIsVerified(true);
                onSuccess({
                    selectedEncryptedId: imageId,
                    questionEncryptedId: questionId!,
                });
            } else {
                setError("Incorrect selection. Please try again.");
                // await fetchCaptcha();
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

    if (error) {
        return (
            <div className="bg-gray-700 p-4 rounded">
                <p className="text-red-500">{error}</p>
                <button
                    onClick={fetchCaptcha}
                    disabled={isLoading}
                    className="mt-4 px-4 py-2 bg-gray-600 text-gray-100 rounded"
                >
                    Retry Captcha
                </button>
            </div>
        );
    }

    return (
        <div>
            <h3 className="text-gray-200 font-semibold mb-2">
                Click on the image that best matches the keyword:{" "}
                <span className="ml-2 text-gray-50 font-bold text-2xl">{`${question}`}</span>
            </h3>
            <div className="flex flex-wrap gap-2 justify-center">
                {isLoadingImages
                    ? [
                          ...Array(5).map((_, index) => (
                              <LoadingImagePlaceholder key={index} />
                          )),
                      ]
                    : images.map((image) => (
                          <button
                              key={image.encryptedId}
                              onClick={() =>
                                  handleImageClick(image.encryptedId)
                              }
                              disabled={isLoading}
                              className="relative"
                          >
                              <Image
                                  quality={25}
                                  priority={true}
                                  width={150}
                                  height={150}
                                  className={`${
                                      isLoading ? "opacity-50" : ""
                                  } object-cover rounded`}
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
            <button
                onClick={fetchCaptcha}
                disabled={isLoading || isLoadingImages}
                className="mt-4 mb-4 px-4 py-2 bg-gray-600 rounded"
            >
                Restart Captcha
            </button>
        </div>
    );
};

export default Captcha;
