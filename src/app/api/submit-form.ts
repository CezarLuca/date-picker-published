import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === "POST") {
        // const { fomrData } = req.body;

        // Perform server-side validation and handle form submission logic
        // For example, send the form data to your database

        return res.status(200).json({ success: true });
    }

    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
}
