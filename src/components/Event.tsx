// Event.tsx
import { Event } from "@/types/types";
import { formatDateTime } from "@/lib/utils/dateFormatter";
import EditPersonalNotesModal from "./EditPersonalNotesModal";
import { useState } from "react";

interface EventProps {
    event: Event;
}

export const EventCard: React.FC<EventProps> = ({ event }) => {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const { date: createdAtDate, time: createdAtTime } = formatDateTime(
        event.created_at
    );

    return (
        <>
            <div className="grid grid-cols-[0.5fr_auto_3fr] gap-4 w-full p-6 border rounded-lg bg-gray-700 border-gray-600">
                {/* Date Section */}
                <div className="flex items-center justify-center">
                    <div className="text-center">
                        <span className="text-lg lg:text-3xl md:text-xl sm:text-xl xs:text-lg  font-bold text-gray-200">
                            {event.date}
                        </span>
                    </div>
                </div>
                {/* Arrow Separator */}
                <div className="flex items-center justify-center text-gray-400">
                    <svg
                        className="h-16 w-8"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 7l5 5m0 0l-5 5m5-5H6"
                        />
                    </svg>
                </div>
                {/* Content Section */}
                <div className="space-y-4">
                    {/* Header Info */}
                    <div className="mb-4">
                        <h3 className="text-2xl font-bold text-gray-100">
                            {event.name}
                        </h3>
                        <p className="text-xl text-gray-300">{event.email}</p>
                        <p className="text-sm text-gray-400 mt-1">
                            Created: {createdAtDate} at {createdAtTime}
                        </p>
                    </div>
                    {/* Scrollable Content */}
                    <div className="space-y-4">
                        <div>
                            <h4 className="text-sm font-medium text-gray-400 mb-2">
                                Description
                            </h4>
                            <div className="max-h-32 overflow-y-auto p-3 bg-gray-800 rounded border border-gray-600">
                                <p className="text-gray-200 whitespace-pre-wrap">
                                    {event.description}
                                </p>
                            </div>
                        </div>
                        <div>
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                                <h4 className="text-sm font-medium text-gray-400">
                                    Personal Notes
                                </h4>
                                <button
                                    onClick={() => setIsEditModalOpen(true)}
                                    className="mt-2 md:mt-0 px-3 py-1 text-sm font-medium text-gray-200 bg-gray-600 rounded-md hover:bg-gray-500 transition-colors"
                                >
                                    Edit personal notes
                                </button>
                            </div>
                            <div className="max-h-32 overflow-y-auto p-3 bg-gray-800 rounded border border-gray-600">
                                {event.personal_notes ? (
                                    <p className="text-gray-200 whitespace-pre-wrap">
                                        {event.personal_notes}
                                    </p>
                                ) : (
                                    <p className="text-gray-400 italic">
                                        No personal notes added.
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <EditPersonalNotesModal
                open={isEditModalOpen}
                event={event}
                onClose={() => setIsEditModalOpen(false)}
            />
        </>
    );
};
