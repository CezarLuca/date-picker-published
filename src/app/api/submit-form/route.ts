import { NextResponse } from "next/server";
import { supabaseServer } from "@/utils/supabaseServerClient";

export async function POST(req: Request) {
    const body = await req.json();
    const { date, name, email, description } = body;

    if (!name || !email || !description) {
        return NextResponse.json(
            { error: "Please fill in all fields" },
            { status: 400 }
        );
    }

    // Insert form data into the database
    try {
        const { error } = await supabaseServer.from("events").insert([
            {
                date,
                name,
                email,
                description,
            },
        ]);

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
