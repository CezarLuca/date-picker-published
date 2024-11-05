// import type { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";
import { supabaseServer } from "@/utils/supabaseServerClient";

// export default async function handler(
//     req: NextApiRequest,
//     res: NextApiResponse
// ) {
//     if (req.method === "POST") {
export async function POST(req: Request) {
    const body = await req.json();
    const { date, name, email, description } = body;

    if (!name || !email || !description) {
        // return res.status(400).json({ error: "Please fill in all fields" });
        return NextResponse.json(
            { error: "Please fill in all fields" },
            { status: 400 }
        );
    }

    // // Validate captcha data
    // const { selectedKeyword, question } = captchaData || {};
    // if (!selectedKeyword || !question) {
    //     // return res
    //     //     .status(400)
    //     //     .json({ error: "Please complete the captcha" });
    //     return NextResponse.json(
    //         { error: "Please complete the captcha" },
    //         { status: 400 }
    //     );
    // }
    // if (selectedKeyword !== question) {
    //     // return res
    //     //     .status(400)
    //     //     .json({ error: "Incorrect selection, please try again." });
    //     return NextResponse.json(
    //         { error: "Incorrect selection, please try again." },
    //         { status: 400 }
    //     );
    // }

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
            // return res
            //     .status(500)
            //     .json({ error: `Error saving data: ${error.message}` });
            return NextResponse.json(
                { error: `Error saving data: ${error.message}` },
                { status: 500 }
            );
        }

        // return res.status(200).json({ success: true });
        return NextResponse.json({ success: true }, { status: 200 });
    } catch (err) {
        console.error("Error saving data:", err);
        // return res
        //     .status(500)
        //     .json({ error: "An unexpected error occurred" });
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

// res.setHeader("Allow", ["POST"]);
// return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
// }
