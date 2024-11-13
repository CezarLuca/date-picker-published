import { createContext, ReactNode, useState } from "react";
import { Event } from "@/types/types";
import { supabase } from "@/lib/utils/supabaseClient";

interface EventsContextType {
    events: Event[];
    scheduledDates: (string | number | Date)[];
    refreshEvents: () => Promise<void>;
    updateEventNotes: (eventId: string, notes: string) => Promise<void>;
    deleteScheduledDate: (date: string) => Promise<void>;
}

const EventsContext = createContext<EventsContextType | undefined>(undefined);

export function EventsProvider({ children }: { children: ReactNode }) {
    const [events, setEvents] = useState<Event[]>([]);
    const [scheduledDates, setScheduledDates] = useState<
        (string | number | Date)[]
    >([]);

    const fetchScheduledDates = async () => {
        const today = new Date().toISOString().split("T")[0];
        const { data, error } = await supabase
            .from("events_scheduled")
            .select("date")
            .gte("date", today)
            .order("date", { ascending: true });

        if (!error && data) {
            setScheduledDates(data.map((item) => item.date));
        }
    };

    const fetchEvents = async () => {
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
    };
}
