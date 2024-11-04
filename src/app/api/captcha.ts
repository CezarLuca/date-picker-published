import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/utils/supabaseClient";

// interface CaptchaImage {
//     id: number;
//     image_url: string;
//     keyword: string;
// }

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === "GET") {
        const { data, error } = await supabase
            .from("captcha_images")
            .select("id, image_url, keyword")
            .order("id", { ascending: false })
            .limit(20);

        if (error) {
            return res
                .status(500)
                .json({ error: `Error fetching images: ${error.message}` });
        }
        const shuffledImages = data.sort(() => Math.random() - 0.5);
        const selectedImages = shuffledImages.slice(0, 5);
        const randomImage =
            selectedImages[Math.floor(Math.random() * selectedImages.length)];

        return res
            .status(200)
            .json({ images: selectedImages, question: randomImage.keyword });
    }
    if (req.method === "POST") {
        const { selectedKeyword, question } = req.body;
        if (selectedKeyword === question) {
            return res.status(200).json({ success: true });
        } else {
            return res
                .status(400)
                .json({ error: "Incorrect selection, please try again." });
        }
    }

    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).json({ error: `Method ${req.method} Not Allowed` });

    return res.status(405).json({ error: "Method not allowed" });
}
