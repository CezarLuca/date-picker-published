import { Event } from "@/types/types";
import { formatDateTime } from "@/lib/utils/dateFormatter";

interface EventProps {
    event: Event;
}

export const EventCard: React.FC<EventProps> = ({ event }) => {
    const { date: createdAtDate, time: createdAtTime } = formatDateTime(
        event.created_at
    );

    return (
        <div className="p-4 border rounded-lg bg-gray-700 border-gray-600">
            <h3 className="text-lg font-medium text-gray-100">{event.name}</h3>
            <p className="text-sm text-gray-400">{event.email}</p>
            <p className="mt-2 text-gray-300">{event.description}</p>
            <p className="mt-2 text-sm text-gray-400">
                Created: {createdAtDate} at {createdAtTime}
            </p>
            {event.personal_notes && (
                <div className="mt-2">
                    <p className="text-sm font-medium text-gray-400">
                        Personal Notes:
                    </p>
                    <p className="text-gray-300">{event.personal_notes}</p>
                </div>
            )}
        </div>
    );
};
