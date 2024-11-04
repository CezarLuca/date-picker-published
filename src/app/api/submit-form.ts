import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/utils/supabaseClient";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === "POST") {
        const { date, name, email, description, captchaData } = req.body;

        if (!name || !email || !description || !captchaData) {
            return res.status(400).json({ error: "Please fill in all fields" });
        }

        // Validate captcha data
        const { selectedKeyword, question } = captchaData || {};
        if (!selectedKeyword || !question) {
            return res
                .status(400)
                .json({ error: "Please complete the captcha" });
        }
        if (selectedKeyword !== question) {
            return res
                .status(400)
                .json({ error: "Incorrect selection, please try again." });
        }

        // Insert form data into the database

        try {
            const { error } = await supabase.from("events").insert([
                {
                    date,
                    name,
                    email,
                    description,
                },
            ]);

            if (error) {
                return res
                    .status(500)
                    .json({ error: `Error saving data: ${error.message}` });
            }

            return res.status(200).json({ success: true });
        } catch (err) {
            console.error("Error saving data:", err);
            return res
                .status(500)
                .json({ error: "An unexpected error occurred" });
        }
    }

    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
}
