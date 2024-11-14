"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { supabase } from "../lib/utils/supabaseClient";
import { useEvents } from "@/contexts/EventsContext";

interface MonthProps {
    currentMonth: number;
    currentYear: number;
}

const DAYS_OF_WEEK = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const Month: React.FC<MonthProps> = ({ currentMonth, currentYear }) => {
    const router = useRouter();
    const [busyDays, setBusyDays] = useState<number[][]>([[]]);
    const [isLoading, setIsLoading] = useState(true);
    const [isBusyDaysLoading, setIsBusyDaysLoading] = useState(true);
    const {
        scheduledDates,
        isLoading: isScheduledDatesLoading,
        refreshEvents,
    } = useEvents();

    // Convert scheduledDates from context to the format we need
    const scheduledDays = scheduledDates.map((dateStr) => {
        const date = new Date(dateStr);
        return [
            date.getDate(),
            date.getMonth() + 1,
            date.getFullYear(),
        ] as number[];
    });

    useEffect(() => {
        // Fetch busyDays from the database
        const fetchBusyDays = async () => {
            setIsBusyDaysLoading(true);
            try {
                const { data, error } = await supabase
                    .from("busy_days")
                    .select("day, month, year")
                    .eq("month", currentMonth)
                    .eq("year", currentYear);
                if (error) throw error;

                setBusyDays(
                    data
                        .filter(
                            (item) =>
                                item.day !== null &&
                                item.month !== null &&
                                item.year !== null
                        )
                        .map(
                            (item) =>
                                [item.day, item.month, item.year] as number[]
                        )
                );
            } catch (error) {
                console.error("Error fetching busy days:", error);
            } finally {
                setIsBusyDaysLoading(false);
                setIsLoading(false);
            }
        };

        fetchBusyDays();
        refreshEvents();
    }, [currentMonth, currentYear, refreshEvents]);

    const currentDate = new Date();
    const isThisMonth =
        currentDate.getMonth() === currentMonth - 1 &&
        currentDate.getFullYear() === currentYear;
    const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();
    const firstDayOfMonth = new Date(currentYear, currentMonth - 1, 1).getDay();
    const adjustedFirstDayOfMonth = (firstDayOfMonth + 6) % 7;
    const lastDayOfMonth = new Date(
        currentYear,
        currentMonth - 1,
        daysInMonth
    ).getDay();
    const adjustedLastDayOfMonth = (lastDayOfMonth + 6) % 7;

    const handleDayClick = (day: number) => {
        router.push(`/form?date=${currentYear}-${currentMonth}-${day}`);
    };

    // Loading UI components
    const LoadingSkeleton = () => (
        <div className="animate-pulse">
            <div className="grid grid-cols-7 gap-1">
                {[...Array(42)].map((_, i) => (
                    <div key={i} className="h-12 bg-gray-600 rounded m-1"></div>
                ))}
            </div>
        </div>
    );

    const renderDays = () => {
        const days = [];
        const emptyStartDays = adjustedFirstDayOfMonth;
        const emptyEndDays = 6 - adjustedLastDayOfMonth;

        // Render empty cells for start of month
        for (let i = 0; i < emptyStartDays; i++) {
            days.push(
                <div
                    key={`empty-start-${i + Math.random()}`}
                    className="p-2 m-1 rounded"
                >
                    {" "}
                </div>
            );
        }

        // Render days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const isPast = isThisMonth && day < currentDate.getDate();
            const isBusy = busyDays.some(
                ([busyDay, busyMonth, busyYear]) =>
                    day === busyDay &&
                    currentMonth === busyMonth &&
                    currentYear === busyYear
            );
            const isScheduled = scheduledDays.some(
                ([schedDay, schedMonth, schedYear]) =>
                    day === schedDay &&
                    currentMonth === schedMonth &&
                    currentYear === schedYear
            );
            days.push(
                <button
                    key={day}
                    className={`p-2 m-1 rounded ${
                        isPast
                            ? "bg-gray-700 text-gray-500 text-center"
                            : isBusy
                            ? "bg-red-500 text-white cursor-not-allowed text-center"
                            : isScheduled
                            ? "bg-yellow-500 text-white cursor-not-allowed text-center"
                            : "bg-gray-700 hover:bg-gray-600 cursor-pointer text-center"
                    }`}
                    onClick={() =>
                        !isPast &&
                        !isBusy &&
                        !isScheduled &&
                        handleDayClick(day)
                    }
                >
                    {day}
                </button>
            );
        }

        // Render empty cells for end of month
        for (let i = 0; i < emptyEndDays; i++) {
            days.push(
                <div
                    key={`empty-end-${i + Math.random()}`}
                    className="p-2 m-1 rounded"
                >
                    {" "}
                </div>
            );
        }

        if (days.length <= 35) {
            for (let i = 0; i < 36 - days.length; i++) {
                days.push(
                    <div
                        key={`height-adjust-${i + Math.random()}`}
                        className="p-2 m-1 rounded"
                    >
                        {" "}
                    </div>
                );
            }
        }
        return days;
    };

    return (
        <div className="bg-gray-700 px-2 rounded">
            {(isLoading || isBusyDaysLoading || isScheduledDatesLoading) && (
                <div className="absolute inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-10">
                    <LoadingSkeleton />
                </div>
            )}

            <div className="grid grid-cols-7 grid-rows-7 gap-1 ">
                {DAYS_OF_WEEK.map((day) => (
                    <div
                        key={day}
                        className="p-2 font-bold text-center text-gray-300"
                    >
                        {day}
                    </div>
                ))}
                {renderDays()}
            </div>
        </div>
    );
};

export default Month;
