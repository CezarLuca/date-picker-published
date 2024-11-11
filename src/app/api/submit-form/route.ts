import { NextResponse } from "next/server";
import { z } from "zod";
import { supabaseServer } from "@/lib/utils/supabaseServerClient";
import { sendFormSubmissionEmail } from "@/lib/utils/emailService";

const formSchema = z.object({
    date: z.string(),
    name: z
        .string()
        .min(1)
        .max(99)
        .refine((val) => val.trim().split(/\s+/).length >= 2, {
            message: "Name must have at least two words",
        })
        .refine((val) => !/[&\\|^<>]/.test(val), {
            message: "Name contains invalid special characters",
        }),
    email: z.string().email(),
    description: z
        .string()
        .min(1)
        .max(999)
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

export async function POST(req: Request) {
    try {
        const body = await req.json();

        // Validate the request body using formSchema
        const result = formSchema.safeParse(body);

        if (!result.success) {
            // Return validation errors
            return NextResponse.json(
                { error: result.error.issues[0].message },
                { status: 400 }
            );
        }

        const { date, name, email, description, captchaData } = result.data;
        const { selectedEncryptedId, questionEncryptedId } = captchaData;

        // Verify captcha server-side
        const captchaResponse = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/captcha`,
            // `/api/captcha`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    selectedEncryptedId,
                    questionEncryptedId,
                }),
            }
        );

        const captchaResult = await captchaResponse.json();

        if (!captchaResult.success) {
            return NextResponse.json(
                { error: "Captcha verification failed" },
                { status: 400 }
            );
        }

        // Continue with database operations only if captcha passes
        // Insert into both tables using Promise.all for better performance
        const [eventsResult, scheduleResult] = await Promise.all([
            supabaseServer
                .from("events")
                .insert([{ date, name, email, description }]),
            supabaseServer.from("events_scheduled").insert([{ date }]),
        ]);

        // Check for errors in either insert operation
        if (eventsResult.error) {
            return NextResponse.json(
                {
                    error: `Error saving to events: ${eventsResult.error.message}`,
                },
                { status: 500 }
            );
        }

        if (scheduleResult.error) {
            return NextResponse.json(
                {
                    error: `Error saving to events_scheduled: ${scheduleResult.error.message}`,
                },
                { status: 500 }
            );
        }

        // Send email notification
        try {
            await sendFormSubmissionEmail({ date, name, email, description });
        } catch (emailError) {
            console.error("Error sending email:", emailError);
            // Continue execution even if email fails
        }

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (err) {
        console.error("Error saving data:", err);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
