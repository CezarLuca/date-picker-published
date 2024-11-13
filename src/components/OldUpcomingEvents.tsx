import { useEffect, useState } from "react";
import { supabase } from "@/lib/utils/supabaseClient";
import { Event } from "@/types/types";
import { EventCard } from "./Event";

export const UpcomingEvents: React.FC = () => {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const today = new Date().toISOString().split("T")[0];

                // First, get upcoming dates from events_scheduled
                const { data: scheduledDates, error: scheduledError } =
                    await supabase
                        .from("events_scheduled")
                        .select("date")
                        .gte("date", today)
                        .order("date", { ascending: true });

                if (scheduledError) throw scheduledError;
                if (!scheduledDates || scheduledDates.length === 0) {
                    setEvents([]);
                    return;
                }

                // Extract the dates into an array
                const upcomingDates = scheduledDates.map((item) => item.date);

                // Then fetch events matching these dates
                const { data: eventsData, error: eventsError } = await supabase
                    .from("events")
                    .select(
                        `
                    id,
                    date,
                    name,
                    email,
                    description,
                    created_at,
                    personal_notes
                `
                    )
                    .in("date", upcomingDates)
                    .order("date", { ascending: true });

                if (eventsError) throw eventsError;
                setEvents(eventsData || []);
            } catch (err) {
                setError(
                    err instanceof Error ? err.message : "An error occurred"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    // console.log(events);

    if (loading) return <div className="text-gray-300">Loading events...</div>;
    if (error) return <div className="text-red-500">Error: {error}</div>;

    return (
        <div className="space-y-4 pt-4 border bg-gray-800 border-gray-700">
            <h2 className="text-xl py-4 font-bold text-center text-gray-100">
                Upcoming Events
            </h2>
            {events.length === 0 ? (
                <p className="text-gray-400">No upcoming events found</p>
            ) : (
                <div className="flex flex-col gap-4">
                    {events.map((event) => (
                        <EventCard key={event.created_at} event={event} />
                    ))}
                </div>
            )}
        </div>
    );
};
