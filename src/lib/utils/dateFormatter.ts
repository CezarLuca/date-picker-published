export const formatDateTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return {
        date: date.toISOString().split("T")[0], // yyyy-mm-dd
        time: date.toLocaleTimeString("en-GB", {
            timeZone: "Europe/Paris",
            hour: "2-digit",
            minute: "2-digit",
        }),
    };
};
