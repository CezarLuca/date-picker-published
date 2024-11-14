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
        // eventId: string,
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

    // const fetchScheduledDates = useCallback(async () => {
    //     const today = new Date().toISOString().split("T")[0];
    //     const { data, error } = await supabase
    //         .from("events_scheduled")
    //         .select("date")
    //         .gte("date", today)
    //         .order("date", { ascending: true });

    //     if (!error && data) {
    //         setScheduledDates(data.map((item) => item.date));
    //     }
    // }, []); // No dependencies as it only uses supabase and setScheduledDates

    // const fetchEvents = useCallback(async () => {
    //     const today = new Date().toISOString().split("T")[0];
    //     const { data: scheduledDates } = await supabase
    //         .from("events_scheduled")
    //         .select("date")
    //         .gte("date", today)
    //         .order("date", { ascending: true });

    //     if (scheduledDates && scheduledDates.length > 0) {
    //         const upcomingDates = scheduledDates.map((item) => item.date);
    //         const { data: eventsData } = await supabase
    //             .from("events")
    //             .select("*")
    //             .in("date", upcomingDates)
    //             .order("date", { ascending: true });

    //         setEvents(eventsData || []);
    //     } else {
    //         setEvents([]);
    //     }
    // }, []);

    // const refreshEvents = useCallback(async () => {
    //     setIsLoading(true);
    //     await Promise.all([
    //         fetchEvents(),
    //         fetchScheduledDates(),
    //         setIsLoading(false),
    //     ]);
    // }, [fetchEvents, fetchScheduledDates]);

    // const refreshEvents = useCallback(async () => {
    //     setIsLoading(true);
    //     try {
    //         const today = new Date().toISOString().split("T")[0];

    //         // Fetch scheduled dates
    //         const { data: freshScheduledDates, error: scheduledError } =
    //             await supabase
    //                 .from("events_scheduled")
    //                 .select("date")
    //                 .gte("date", today)
    //                 .order("date", { ascending: true });

    //         if (scheduledError) throw scheduledError;

    //         if (freshScheduledDates && freshScheduledDates.length > 0) {
    //             setScheduledDates(freshScheduledDates.map((item) => item.date));

    //             // Fetch corresponding events
    //             const { data: eventsData, error: eventsError } = await supabase
    //                 .from("events")
    //                 .select("*")
    //                 .in(
    //                     "date",
    //                     freshScheduledDates.map((item) => item.date)
    //                 )
    //                 .order("date", { ascending: true });

    //             if (eventsError) throw eventsError;
    //             setEvents(eventsData);
    //         } else {
    //             // No scheduled dates, clear the events and scheduledDates arrays
    //             setScheduledDates([]);
    //             setEvents([]);
    //         }
    //     } catch (error) {
    //         console.error("Error fetching events", error);
    //         // Optionally, set events and scheduledDates to empty arrays on error
    //         setScheduledDates([]);
    //         setEvents([]);
    //     } finally {
    //         setIsLoading(false);
    //     }
    // }, []);

    // const refreshEvents = useCallback(async () => {
    //     setIsLoading(true);
    //     try {
    //         const today = new Date().toISOString().split("T")[0];

    //         // First fetch all scheduled dates
    //         const { data: freshScheduledDates, error: scheduledError } =
    //             await supabase
    //                 .from("events_scheduled")
    //                 .select("date")
    //                 .gte("date", today)
    //                 .order("date", { ascending: true });

    //         if (scheduledError) throw scheduledError;

    //         // Update scheduled dates state
    //         const dates = freshScheduledDates?.map((item) => item.date) || [];
    //         setScheduledDates(dates);

    //         // Only fetch events if we have scheduled dates
    //         if (dates.length > 0) {
    //             const { data: eventsData, error: eventsError } = await supabase
    //                 .from("events")
    //                 .select("*")
    //                 .in("date", dates)
    //                 .order("date", { ascending: true });

    //             if (eventsError) throw eventsError;

    //             // Update events state with the fetched data
    //             setEvents(eventsData || []);
    //         } else {
    //             // Clear events if no scheduled dates
    //             setEvents([]);
    //         }
    //     } catch (error) {
    //         console.error("Error refreshing events:", error);
    //         setEvents([]);
    //         setScheduledDates([]);
    //     } finally {
    //         setIsLoading(false);
    //     }
    // }, []);

    const refreshEvents = useCallback(async () => {
        setIsLoading(true);
        try {
            const today = new Date().toISOString().split("T")[0];

            // First fetch all scheduled dates
            const scheduledQuery = supabase
                .from("events_scheduled")
                .select("date")
                .gte("date", today)
                .order("date", { ascending: true });

            // Fetch events separately for dates we know exist
            const eventsQuery = supabase
                .from("events")
                .select("*")
                .gte("date", today)
                .order("date", { ascending: true });

            // Run both queries in parallel
            const [scheduledResult, eventsResult] = await Promise.all([
                scheduledQuery,
                eventsQuery,
            ]);

            if (scheduledResult.error) throw scheduledResult.error;
            if (eventsResult.error) throw eventsResult.error;

            // Update scheduled dates state
            const dates = scheduledResult.data?.map((item) => item.date) || [];
            setScheduledDates(dates);

            // Filter events to only include those with scheduled dates
            const filteredEvents =
                eventsResult.data?.filter((event) =>
                    dates.includes(event.date)
                ) || [];

            setEvents(filteredEvents);
        } catch (error) {
            console.error("Error refreshing events:", error);
            setEvents([]);
            setScheduledDates([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const updateEventNotes = async (eventId: number, notes: string) => {
        // const { error } = await supabase
        //     .from("events")
        //     .update({ personal_notes: notes })
        //     .eq("id", eventId);
        // if (!error) {
        //     await refreshEvents();
        // }
        // return error;

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

    // useEffect(() => {
    //     refreshEvents();

    //     // Set up real-time subscriptions
    //     const eventSubscription = supabase
    //         .channel("events-channel")
    //         .on(
    //             "postgres_changes",
    //             { event: "*", schema: "public", table: "events" },
    //             () => refreshEvents()
    //         )
    //         .subscribe();

    //     const scheduledSubscription = supabase
    //         .channel("scheduled-channel")
    //         .on(
    //             "postgres_changes",
    //             {
    //                 event: "*",
    //                 schema: "public",
    //                 table: "events_scheduled",
    //             },
    //             () => refreshEvents()
    //         )
    //         .subscribe();

    //     return () => {
    //         eventSubscription.unsubscribe();
    //         scheduledSubscription.unsubscribe();
    //     };
    // }, [refreshEvents]);

    // useEffect(() => {
    //     refreshEvents();

    //     const channel = supabase
    //         .channel("events-changes")
    //         .on(
    //             "postgres_changes",
    //             { event: "*", schema: "public", table: "events" },
    //             refreshEvents
    //         )
    //         .on(
    //             "postgres_changes",
    //             { event: "*", schema: "public", table: "events_scheduled" },
    //             refreshEvents
    //         )
    //         .subscribe();

    //     return () => {
    //         channel.unsubscribe();
    //     };
    // }, [refreshEvents]);

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
