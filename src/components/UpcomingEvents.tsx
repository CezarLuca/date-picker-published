"use client";

import { useEvents } from "@/contexts/EventsContext";
import { EventCard } from "./Event";

export const UpcomingEvents: React.FC = () => {
    const { events, isLoading } = useEvents();

    // if (!events) return <div className="text-gray-300">Loading events...</div>;

    if (isLoading) {
        return (
            <div className="flex justify-center items-center p-8">
                <div className="text-gray-300">Loading events...</div>
            </div>
        );
    }

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
                        <EventCard key={event.id} event={event} />
                    ))}
                </div>
            )}
        </div>
    );
};
