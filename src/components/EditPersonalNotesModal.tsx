import { useState } from "react";
import { Dialog, DialogPanel } from "@headlessui/react";
import { useEvents } from "@/contexts/EventsContext";
import { Event } from "@/types/types";
import { formatDateTime } from "@/lib/utils/dateFormatter";
import ConfirmationModal from "./ConfirmationModal";

interface EditPersonalNotesModalProps {
    open: boolean;
    onClose: () => void;
    event: Event;
}

const EditPersonalNotesModal = ({
    open,
    event,
    onClose,
}: EditPersonalNotesModalProps) => {
    const [notes, setNotes] = useState(event.personal_notes || "");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { updateEventNotes, deleteScheduledDate } = useEvents();
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

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
    const handleSave = async () => {
        setIsLoading(true);
        setError(null);

        try {
            await updateEventNotes(event.id, notes);
            onClose();
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Failed to update notes"
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Dialog open={open} onClose={onClose} className="relative z-50">
                <div
                    className="fixed inset-0 bg-gray-900/75"
                    aria-hidden="true"
                />
                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <DialogPanel className="bg-gray-800 rounded-lg p-6 max-w-4xl w-full">
                        <div className="flex flex-col gap-4 w-full">
                            {/* Top Section */}
                            <div className="grid grid-cols-1 lg:grid-cols-[300px_100px_minmax(0,1fr)] gap-4">
                                {/* Date and Delete Button Box */}
                                <div
                                    className="flex flex-row lg:flex-col items-center justify-between lg:justify-center gap-4 p-2
                                    border bg-gray-800 border-gray-600
                                    absolute lg:relative top-0 left-0 right-0 rounded-t-lg lg:rounded-lg
                                    shadow-md min-w-[300px]"
                                >
                                    <div className="text-center">
                                        <span className="text-2xl lg:text-4xl font-bold text-gray-200">
                                            {event.date}
                                        </span>
                                    </div>
                                    <button
                                        onClick={() =>
                                            setIsConfirmModalOpen(true)
                                        }
                                        className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
                                    >
                                        Delete
                                    </button>
                                </div>
                                {/* Arrow Separator */}
                                <div className="hidden lg:flex items-center justify-center text-gray-400 min-w-[100px]">
                                    <svg
                                        className="h-20 w-36"
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
                                {/* Header Info Section */}
                                <div className="mt-16 lg:mt-6 mb-4 min-w-0">
                                    <h3 className="text-2xl font-bold text-gray-100 truncate">
                                        {event.name}
                                    </h3>
                                    <p className="text-xl text-gray-300 mt-2 truncate">
                                        {event.email}
                                    </p>
                                    <p className="text-sm text-gray-400 mt-1">
                                        Created: {createdAtDate} at{" "}
                                        {createdAtTime}
                                    </p>
                                </div>
                            </div>
                            {/* Description Section */}
                            <div className="space-y-4">
                                <div>
                                    <h4 className="text-sm font-lg font-bold text-gray-300 mb-2 mt-1 ml-4">
                                        Description
                                    </h4>
                                    <div className="max-h-32 overflow-y-auto p-3 bg-gray-800 rounded border border-gray-600">
                                        <p className="text-gray-200 whitespace-pre-wrap">
                                            {event.description}
                                        </p>
                                    </div>
                                </div>
                                {/* Personal Notes Edit Section */}
                                <div>
                                    <h4 className="text-sm font-lg font-bold text-gray-300 mb-2 mt-1 ml-4">
                                        Edit Personal Notes
                                    </h4>
                                    <textarea
                                        value={notes}
                                        onChange={(e) =>
                                            setNotes(e.target.value)
                                        }
                                        className="w-full h-72 p-4 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Add your personal notes here..."
                                        disabled={isLoading}
                                    />
                                    {error && (
                                        <p className="text-red-500 text-sm">
                                            {error}
                                        </p>
                                    )}
                                </div>
                            </div>
                            {/* Action Buttons */}
                            <div className="mt-6 flex justify-end gap-3">
                                <button
                                    onClick={onClose}
                                    className="px-4 py-2 text-sm font-medium text-gray-200 bg-gray-700 rounded-md hover:bg-gray-600 transition-colors"
                                    disabled={isLoading}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-800 disabled:cursor-not-allowed"
                                    disabled={isLoading}
                                >
                                    {isLoading ? "Saving..." : "Save Changes"}
                                </button>
                            </div>
                        </div>
                    </DialogPanel>
                </div>
            </Dialog>
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

export default EditPersonalNotesModal;
