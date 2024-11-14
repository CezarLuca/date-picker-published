"use client";
import { Event } from "@/types/types";
import { formatDateTime } from "@/lib/utils/dateFormatter";
import EditPersonalNotesModal from "./EditPersonalNotesModal";
import ConfirmationModal from "./ConfirmationModal";
import { useState } from "react";
import { useEvents } from "@/contexts/EventsContext";

interface EventProps {
    event: Event;
}

export const EventCard: React.FC<EventProps> = ({ event }) => {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const { deleteScheduledDate } = useEvents();

    const { date: createdAtDate, time: createdAtTime } = formatDateTime(
        event.created_at
    );

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            await deleteScheduledDate(event.date);
            setIsConfirmModalOpen(false);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <>
            <div className="flex flex-col gap-4 w-full p-6 border rounded-lg bg-gray-700 border-gray-600 relative">
                {/* Top Section */}
                <div className="grid grid-cols-1 lg:grid-cols-[0.5fr_auto_3fr] gap-4">
                    {/* Date and Buttons Box */}
                    <div
                        className="flex flex-row lg:flex-col items-center justify-between lg:justify-center gap-2 p-4 border bg-gray-800 border-gray-600 
                    absolute lg:relative top-0 left-0 right-0 rounded-t-lg lg:rounded-lg
                    shadow-md"
                    >
                        <div className="text-center">
                            <span className="text-lg lg:text-3xl md:text-xl sm:text-xl xs:text-lg font-bold text-gray-200">
                                {event.date}
                            </span>
                        </div>
                        <div className="flex flex-row lg:flex-col gap-2">
                            <button
                                onClick={() => setIsEditModalOpen(true)}
                                className="px-3 py-1 text-sm font-medium text-gray-200 bg-gray-600 rounded-md hover:bg-gray-500 transition-colors"
                            >
                                Edit note
                            </button>
                            <button
                                onClick={() => setIsConfirmModalOpen(true)}
                                className="px-3 py-1 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
                            >
                                Delete
                            </button>
                        </div>
                    </div>

                    {/* Arrow Separator - Hidden on mobile */}
                    <div className="hidden lg:flex items-center justify-center text-gray-400">
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
                                d="M9 5l7 7-7 7"
                            />
                        </svg>
                    </div>

                    {/* Header Info Section - Padded on mobile for overlapping box */}
                    <div className="mt-16 lg:mt-0 mb-4">
                        <h3 className="text-2xl font-bold text-gray-100">
                            {event.name}
                        </h3>
                        <p className="text-xl text-gray-300 mt-2">
                            {event.email}
                        </p>
                        <p className="text-sm text-gray-400 mt-1">
                            Created: {createdAtDate} at {createdAtTime}
                        </p>
                    </div>
                </div>

                {/* Full Width Content Section */}
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
                        <h4 className="text-sm font-medium text-gray-400 mb-2">
                            Personal Notes
                        </h4>
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
            <EditPersonalNotesModal
                open={isEditModalOpen}
                event={event}
                onClose={() => setIsEditModalOpen(false)}
            />
            <ConfirmationModal
                isOpen={isConfirmModalOpen}
                onClose={() => setIsConfirmModalOpen(false)}
                onConfirm={handleDelete}
                selectedDate={event.date}
                message="Are you sure you want to delete this scheduled event? This action cannot be undone."
                isLoading={isDeleting}
            />
        </>
    );
};
