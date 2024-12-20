import { NextResponse, NextRequest } from "next/server";
import { supabaseServer } from "@/lib/utils/supabaseServerClient";
import { CaptchaData } from "@/components/Captcha";

const ENCRYPTION_FACTORS = {
    IMAGE: Number(process.env.CAPTCHA_IMAGE_ENCRYPTION),
    QUESTION: Number(process.env.CAPTCHA_QUESTION_ENCRYPTION),
} as const;

interface CaptchaImage {
    id: number;
    image_url: string;
    keyword: string;
}

interface CaptchaImageDisplay {
    encryptedId: number;
    image_url: string;
}

interface CaptchaQuestion {
    id: number;
    keyword: string;
}

interface ImageResponseKeyword {
    keyword: string;
}

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

    // Split data into separate objects
    const displayImages: CaptchaImageDisplay[] = selectedImages.map((img) => ({
        encryptedId: img.id * ENCRYPTION_FACTORS.IMAGE,
        image_url: img.image_url,
    }));

    const questionData: CaptchaQuestion = {
        id: randomImage.id * ENCRYPTION_FACTORS.QUESTION,
        keyword: randomImage.keyword,
    };

    return NextResponse.json({
        images: displayImages,
        questionId: questionData.id,
        question: questionData.keyword,
    });
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { selectedEncryptedId, questionEncryptedId } =
            body as CaptchaData;

        if (!selectedEncryptedId || !questionEncryptedId) {
            return NextResponse.json(
                { error: "Please complete the captcha" },
                { status: 400 }
            );
        }

        // Decrypt IDs using different factors
        const selectedId = selectedEncryptedId / ENCRYPTION_FACTORS.IMAGE;
        const questionId = questionEncryptedId / ENCRYPTION_FACTORS.QUESTION;

        // Verify both decrypted IDs are valid integers
        if (!Number.isInteger(selectedId) || !Number.isInteger(questionId)) {
            return NextResponse.json(
                { error: "Invalid verification attempt" },
                { status: 400 }
            );
        }

        // Extract IP address from request headers
        const ip =
            req.headers.get("x-forwarded-for") ||
            req.headers.get("x-real-ip") ||
            "";

        // Get the failed attempts from the database
        const { data: attemptData } = (await supabaseServer
            .from("captcha_attempts")
            .select("failed_attempts")
            .eq("ip_address", ip)
            .single()) as { data: { failed_attempts: number } };

        let failedAttempts = attemptData?.failed_attempts || 0;

        // Introduce delay based on failed attempts
        const delay = Math.min(failedAttempts * 1000, 30000); // Max delay of 30 seconds
        await new Promise((res) => setTimeout(res, delay));

        // Fetch the actual keyword for the selected image
        const { data: selectedData, error: selectedError } =
            await supabaseServer
                .from("captcha_images")
                .select("keyword")
                .eq("id", selectedId)
                .single();

        // Fetch the expected keyword for the question
        const { data: expectedData, error: expectedError } =
            await supabaseServer
                .from("captcha_images")
                .select("keyword")
                .eq("id", questionId)
                .single();

        // Force TypeScript to treat data as ImageResponseKeyword
        const selectedImage = selectedData as unknown as ImageResponseKeyword;
        const expectedImage = expectedData as unknown as ImageResponseKeyword;

        if (
            selectedError ||
            expectedError ||
            !selectedImage ||
            !expectedImage
        ) {
            return NextResponse.json(
                { error: "Invalid captcha data." },
                { status: 400 }
            );
        }

        if (selectedImage.keyword !== expectedImage.keyword) {
            // Increment failed attempts in the database
            failedAttempts += 1;
            if (attemptData) {
                // Update existing record
                await supabaseServer
                    .from("captcha_attempts")
                    .update({
                        failed_attempts: failedAttempts,
                        last_failed_at: new Date(),
                    })
                    .eq("ip_address", ip);
            } else {
                // Insert new record
                await supabaseServer.from("captcha_attempts").insert({
                    ip_address: ip,
                    failed_attempts: failedAttempts,
                    last_failed_at: new Date(),
                });
            }

            return NextResponse.json(
                { error: "Incorrect selection, please try again." },
                { status: 400 }
            );
        }

        // Reset failed attempts on successful verification
        if (attemptData) {
            await supabaseServer
                .from("captcha_attempts")
                .update({ failed_attempts: 0, last_failed_at: null })
                .eq("ip_address", ip);
        }

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { error: `Invalid request format: ${error}` },
            { status: 400 }
        );
    }
}
