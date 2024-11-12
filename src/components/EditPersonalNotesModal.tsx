import { supabase } from "@/lib/utils/supabaseClient";
import { Event } from "@/types/types";
import { Dialog, DialogPanel } from "@headlessui/react";
import { useState } from "react";

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

    const onSave = async (notes: string) => {
        setIsLoading(true);
        setError(null);

        try {
            const { error: updateError } = await supabase
                .from("events")
                .update({ personal_notes: notes })
                .eq("id", event.id);

            if (updateError) throw updateError;

            // Close modal only if update was successful
            onClose();
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Failed to update notes"
            );
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = () => {
        onSave(notes);
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} className="relative z-50">
            <div className="fixed inset-0 bg-gray-900/75" aria-hidden="true" />
            <div className="fixed inset-0 flex items-center justify-center p-4">
                <DialogPanel className="bg-gray-800 rounded-lg p-6 max-w-4xl w-full">
                    {/* Event Card Style Header */}
                    <div className="grid grid-cols-[0.5fr_auto_3fr] gap-4 w-full p-6 border rounded-lg bg-gray-700 border-gray-600 mb-6">
                        <div className="flex items-center justify-center">
                            <div className="text-center">
                                <span className="text-lg lg:text-3xl md:text-xl sm:text-xl xs:text-lg font-bold text-gray-200">
                                    {event.date}
                                </span>
                            </div>
                        </div>
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
                                    d="M9 5l7 7-7 7"
                                />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-200 mb-2">
                                {event.name}
                            </h2>
                            <p className="text-gray-400">{event.description}</p>
                        </div>
                    </div>

                    {/* Personal Notes Edit Section */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-200">
                            Edit Personal Notes
                        </h3>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            className="w-full h-48 p-4 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Add your personal notes here..."
                            disabled={isLoading}
                        />
                        {error && (
                            <p className="text-red-500 text-sm">{error}</p>
                        )}
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
                </DialogPanel>
            </div>
        </Dialog>
    );
};

export default EditPersonalNotesModal;
