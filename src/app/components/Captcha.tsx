import Image from "next/image";
import { useEffect, useState } from "react";

interface CaptchaImage {
    id: number;
    image_url: string;
    keyword: string;
}

const Captcha: React.FC<{ onSuccess: () => void }> = ({ onSuccess }) => {
    const [images, setImages] = useState<CaptchaImage[]>([]);
    const [question, setQuestion] = useState<string>("");
    const [error, setError] = useState<string>("");

    useEffect(() => {
        const fetchCaptcha = async () => {
            const res = await fetch("/api/captcha");
            const data = await res.json();
            setImages(data.images);
            setQuestion(data.question);
        };
        fetchCaptcha();
    }, []);

    const handleImageClick = async (keyword: string) => {
        const response = await fetch("/api/captcha", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ selectedKeyword: keyword, question }),
        });

        const data = await response.json();

        if (data.success) {
            setError("");
            onSuccess();
        } else {
            setError(`Incorrect selection. Please try again: ${data.error}`);
            refreshCaptcha();
        }
    };

    const refreshCaptcha = async () => {
        const res = await fetch("/api/captcha");
        const data = await res.json();
        setImages(data.images);
        setQuestion(data.question);
    };

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
                    >
                        <Image
                            className="w-50 h-50"
                            src={image.image_url}
                            alt={image.keyword}
                        />
                    </button>
                ))}
            </div>
            {error && <p className="text-red-400">{error}</p>}
            <button onClick={refreshCaptcha}>Refresh</button>
        </div>
    );
};

export default Captcha;
