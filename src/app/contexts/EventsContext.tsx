import {
    createContext,
    ReactNode,
    useCallback,
    useEffect,
    useState,
} from "react";
import { Event } from "@/types/types";
import { supabase } from "@/lib/utils/supabaseClient";
import { PostgrestError } from "@supabase/supabase-js";

interface EventsContextType {
    events: Event[];
    scheduledDates: (string | number | Date)[];
    refreshEvents: () => Promise<void>;
    updateEventNotes: (
        eventId: string,
        notes: string
    ) => Promise<PostgrestError | null>;
    deleteScheduledDate: (date: string) => Promise<PostgrestError | null>;
}

const EventsContext = createContext<EventsContextType | undefined>(undefined);

export function EventsProvider({ children }: { children: ReactNode }) {
    const [events, setEvents] = useState<Event[]>([]);
    const [scheduledDates, setScheduledDates] = useState<
        (string | number | Date)[]
    >([]);

    const fetchScheduledDates = useCallback(async () => {
        const today = new Date().toISOString().split("T")[0];
        const { data, error } = await supabase
            .from("events_scheduled")
            .select("date")
            .gte("date", today)
            .order("date", { ascending: true });

        if (!error && data) {
            setScheduledDates(data.map((item) => item.date));
        }
    }, []); // No dependencies as it only uses supabase and setScheduledDates

    const fetchEvents = useCallback(async () => {
        const today = new Date().toISOString().split("T")[0];
        const { data: scheduledDates } = await supabase
            .from("events_scheduled")
            .select("date")
            .gte("date", today)
            .order("date", { ascending: true });

        if (scheduledDates && scheduledDates.length > 0) {
            const upcomingDates = scheduledDates.map((item) => item.date);
            const { data: eventsData } = await supabase
                .from("events")
                .select("*")
                .in("date", upcomingDates)
                .order("date", { ascending: true });

            setEvents(eventsData || []);
        } else {
            setEvents([]);
        }
    }, []);

    const refreshEvents = useCallback(async () => {
        await Promise.all([fetchEvents(), fetchScheduledDates()]);
    }, [fetchEvents, fetchScheduledDates]);

    const updateEventNotes = async (eventId: string, notes: string) => {
        const { error } = await supabase
            .from("events")
            .update({ personal_notes: notes })
            .eq("id", eventId);
        if (!error) {
            await refreshEvents();
        }
        return error;
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

    useEffect(() => {
        refreshEvents();

        // Set up real-time subscriptions
        const eventSubscription = supabase
            .channel("events-channel")
            .on(
                "postgres_changes",
                { event: "*", schema: "public", table: "events_scheduled" },
                () => refreshEvents()
            )
            .subscribe();

        const scheduledSubscription = supabase
            .channel("scheduled-channel")
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "events_scheduled",
                },
                () => refreshEvents()
            )
            .subscribe();

        return () => {
            eventSubscription.unsubscribe();
            scheduledSubscription.unsubscribe();
        };
    }, [refreshEvents]);

    return (
        <EventsContext.Provider
            value={{
                events,
                scheduledDates,
                refreshEvents,
                updateEventNotes,
                deleteScheduledDate,
            }}
        >
            {children}
        </EventsContext.Provider>
    );
}
