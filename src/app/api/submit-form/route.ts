import { NextResponse } from "next/server";
import { supabaseServer } from "@/utils/supabaseServerClient";
import { z } from "zod";

const formSchema = z.object({
    date: z.string(),
    name: z
        .string()
        .min(1)
        .max(99)
        .refine((val) => val.trim().split(/\s+/).length >= 2, {
            message: "Name must have at least two words",
        })
        .refine((val) => !/&/.test(val), {
            message: "Name cannot contain '&'",
        }),
    email: z.string().email(),
    description: z
        .string()
        .min(1)
        .max(999)
        .refine((val) => !/&/.test(val), {
            message: "Description cannot contain '&'",
        }),
    captchaData: z.any(),
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

        const { date, name, email, description } = result.data;

        // Insert validated data into database
        const { error } = await supabaseServer
            .from("events")
            .insert([{ date, name, email, description }]);

        if (error) {
            return NextResponse.json(
                { error: `Error saving data: ${error.message}` },
                { status: 500 }
            );
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
