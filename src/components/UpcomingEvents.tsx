import { useEvents } from "@/contexts/EventsContext";
import { EventCard } from "./Event";

export const UpcomingEvents: React.FC = () => {
    const { events } = useEvents();

    if (!events) return <div className="text-gray-300">Loading events...</div>;

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
