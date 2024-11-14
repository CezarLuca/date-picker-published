import { supabase } from "@/lib/utils/supabaseClient";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { useEffect, useState } from "react";

interface ConfirmationModalProps {
    isOpen: boolean;
    isLoading?: boolean;
    onClose: () => void;
    onConfirm: () => void;
    message?: string;
    selectedDate: string;
}

const ConfirmationModal = ({
    isOpen,
    isLoading,
    onClose,
    onConfirm,
    message,
    selectedDate,
}: ConfirmationModalProps) => {
    const [eventDetails, setEventDetails] = useState<{
        name: string;
        email: string;
        description: string;
        personal_notes?: string; // Made optional
    } | null>(null);

    useEffect(() => {
        const fetchEventDetails = async () => {
            if (!selectedDate) return;

            const { data, error } = await supabase
                .from("events")
                .select("name, email, description, personal_notes")
                .eq("date", selectedDate)
                .single();

            if (error) {
                console.error("Error fetching event details:", error);
            } else {
                setEventDetails(data);
            }
        };

        if (isOpen) {
            fetchEventDetails();
        }
    }, [isOpen, selectedDate]);

    return (
        <>
            {isLoading ? (
                <Dialog
                    open={isOpen}
                    onClose={onClose}
                    className="relative z-50"
                >
                    <div
                        className="fixed inset-0 bg-gray-900/75"
                        aria-hidden="true"
                    />
                    <div className="fixed inset-0 flex items-center justify-center p-4">
                        <DialogPanel className="bg-gray-800 rounded-lg p-6 max-w-md w-full">
                            <div className="flex items-center justify-center">
                                <svg
                                    className="animate-spin h-8 w-8 text-gray-200"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    />
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A8.001 8.001 0 0112 4V0C6.486 0 2 4.486 2 10h4v7.291z"
                                    />
                                </svg>
                            </div>
                        </DialogPanel>
                    </div>
                </Dialog>
            ) : (
                <Dialog
                    open={isOpen}
                    onClose={onClose}
                    className="relative z-50"
                >
                    <div
                        className="fixed inset-0 bg-gray-900/75"
                        aria-hidden="true"
                    />
                    <div className="fixed inset-0 flex items-center justify-center p-4">
                        <DialogPanel className="bg-gray-800 rounded-lg p-6 max-w-md w-full">
                            <DialogTitle className="text-xl font-semibold mb-4 text-gray-200">
                                Confirm Deletion
                            </DialogTitle>
                            {eventDetails && (
                                <div className="mb-6 space-y-4">
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-400">
                                            Client Name
                                        </h3>
                                        <p className="text-gray-200">
                                            {eventDetails.name}
                                        </p>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-400">
                                            Email
                                        </h3>
                                        <p className="text-gray-200">
                                            {eventDetails.email}
                                        </p>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-400">
                                            Description
                                        </h3>
                                        <p className="text-gray-200 max-h-[4.5rem] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
                                            {eventDetails.description}
                                        </p>
                                    </div>
                                    {eventDetails.personal_notes && (
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-400">
                                                Personal Notes
                                            </h3>
                                            <p className="text-gray-200 max-h-[4.5rem] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
                                                {eventDetails.personal_notes}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}
                            <div className="mt-6">
                                {message && (
                                    <p className="text-gray-300 mb-4 text-sm font-medium">
                                        ⚠️ {message}
                                    </p>
                                )}
                                <div className="flex justify-end gap-3">
                                    <button
                                        onClick={onClose}
                                        className="px-4 py-2 text-sm font-medium text-gray-200 bg-gray-700 rounded-md hover:bg-gray-600 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={onConfirm}
                                        className="px-4 py-2 text-sm font-medium text-gray-100 bg-red-600 rounded-md hover:bg-red-700 transition-colors"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </DialogPanel>
                    </div>
                </Dialog>
            )}
        </>
    );
};

export default ConfirmationModal;
