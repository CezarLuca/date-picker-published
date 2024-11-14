"use client";

import {
    createContext,
    ReactNode,
    useCallback,
    useContext,
    useEffect,
    useState,
} from "react";
import { Event } from "@/types/types";
import { supabase } from "@/lib/utils/supabaseClient";
import { PostgrestError } from "@supabase/supabase-js";

interface EventsContextType {
    events: Event[];
    scheduledDates: (string | Date)[];
    isLoading: boolean;
    refreshEvents: () => Promise<void>;
    updateEventNotes: (
        eventId: number,
        notes: string
    ) => Promise<PostgrestError | null>;
    deleteScheduledDate: (date: string) => Promise<PostgrestError | null>;
}

const EventsContext = createContext<EventsContextType | undefined>(undefined);

export function EventsProvider({ children }: { children: ReactNode }) {
    const [events, setEvents] = useState<Event[]>([]);
    const [scheduledDates, setScheduledDates] = useState<(string | Date)[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const refreshEvents = useCallback(async () => {
        setIsLoading(true);
        try {
            const today = new Date().toISOString().split("T")[0];

            const { data: scheduledDates, error: scheduledError } =
                await supabase
                    .from("events_scheduled")
                    .select("date")
                    .gte("date", today)
                    .order("date", { ascending: true });

            if (scheduledError) throw scheduledError;

            const dates = scheduledDates?.map((item) => item.date) || [];
            setScheduledDates(dates);

            if (dates.length > 0) {
                const { data: eventsData, error: eventsError } = await supabase
                    .from("events")
                    .select("*")
                    .in("date", dates)
                    .order("date", { ascending: true });

                if (eventsError) throw eventsError;
                setEvents(eventsData || []);
            } else {
                setEvents([]);
            }
        } catch (error) {
            console.error("Error refreshing events:", error);
            setEvents([]);
            setScheduledDates([]);
        } finally {
            setIsLoading(false);
        }
    }, []); // Empty dependency array since it doesn't depend on any state

    const updateEventNotes = async (eventId: number, notes: string) => {
        // Optimistically update local state
        setEvents((currentEvents) =>
            currentEvents.map((event) =>
                event.id === eventId
                    ? { ...event, personal_notes: notes }
                    : event
            )
        );

        try {
            const { error } = await supabase
                .from("events")
                .update({ personal_notes: notes })
                .eq("id", eventId);

            if (error) {
                // Revert on error
                await refreshEvents();
                return error;
            }

            return null;
        } catch (error) {
            await refreshEvents();
            return error as PostgrestError;
        }
    };

    const deleteScheduledDate = async (date: string) => {
        const { error } = await supabase
            .from("events_scheduled")
            .delete()
            .eq("date", date);

        if (!error) {
            await refreshEvents();
        }
        return error;
    };

    // Fetch events and scheduled dates on component mount
    useEffect(() => {
        // Initial fetch
        refreshEvents();

        // Set up real-time subscription
        const channel = supabase
            .channel("events-channel")
            .on(
                "postgres_changes",
                { event: "*", schema: "public", table: "events" },
                () => refreshEvents()
            )
            .on(
                "postgres_changes",
                { event: "*", schema: "public", table: "events_scheduled" },
                () => refreshEvents()
            )
            .subscribe();

        return () => {
            channel.unsubscribe();
        };
    }, [refreshEvents]);

    return (
        <EventsContext.Provider
            value={{
                events,
                scheduledDates,
                isLoading,
                refreshEvents,
                updateEventNotes,
                deleteScheduledDate,
            }}
        >
            {children}
        </EventsContext.Provider>
    );
}

export function useEvents() {
    const context = useContext(EventsContext);
    if (!context) {
        throw new Error("useEvents must be used within an EventsProvider");
    }
    return context;
}
