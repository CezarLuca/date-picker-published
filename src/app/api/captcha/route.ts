// import type { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";
// import { supabase } from "@/utils/supabaseClient";
import { supabaseServer } from "@/utils/supabaseServerClient";

interface CaptchaImage {
    id: number;
    image_url: string;
    keyword: string;
}

interface CaptchaData {
    selectedKeyword: string;
    question: string;
}

// export default async function handler(
//     req: NextApiRequest,
//     res: NextApiResponse
// ) {
//     if (req.method === "GET") {
export async function GET() {
    const { data, error } = await supabaseServer
        .from("captcha_images")
        .select("id, image_url, keyword")
        .order("id", { ascending: false })
        .limit(20);

    if (error) {
        console.error("Error fetching images:", error.message);
        return NextResponse.json(
            { error: `Error fetching images: ${error.message}` },
            { status: 500 }
        );
    }
    // Force TypeScript to treat data as CaptchaImage[]
    const typedData = data as unknown as CaptchaImage[];
    if (!typedData || typedData.length === 0) {
        return NextResponse.json(
            { error: "No data returned from the database." },
            { status: 500 }
        );
    }

    const shuffledImages = [...typedData].sort(() => Math.random() - 0.5);
    const selectedImages = shuffledImages.slice(0, 5);
    const randomImage =
        selectedImages[Math.floor(Math.random() * selectedImages.length)];

    // return res
    //     .status(200)
    //     .json({ images: selectedImages, question: randomImage.keyword });
    return NextResponse.json({
        images: selectedImages,
        question: randomImage.keyword,
    });
}
// if (req.method === "POST") {
//     const { selectedKeyword, question } = req.body;
//     if (selectedKeyword === question) {
//         return res.status(200).json({ success: true });
//     } else {
//         return res
//             .status(400)
//             .json({ error: "Incorrect selection, please try again." });
//     }
// }

// res.setHeader("Allow", ["GET", "POST"]);
// res.status(405).json({ error: `Method ${req.method} Not Allowed` });

// return res.status(405).json({ error: "Method not allowed" });
// }

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { selectedKeyword, question } = body as CaptchaData;

        if (!selectedKeyword || !question) {
            return NextResponse.json(
                { error: "Please complete the captcha" },
                { status: 400 }
            );
        }

        if (selectedKeyword !== question) {
            return NextResponse.json(
                { error: "Incorrect selection, please try again." },
                { status: 400 }
            );
        }

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { error: `Invalid request format: ${error}` },
            { status: 400 }
        );
    }
}
