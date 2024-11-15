"use client";

import { useState, useEffect } from "react";
import { supabase } from "../lib/utils/supabaseClient";
import ConfirmationModal from "./ConfirmationModal";
import { useEvents } from "@/contexts/EventsContext";
import CalendarDayPlaceholder from "./CalendarDayPlaceholder";

interface MonthProps {
    currentMonth: number;
    currentYear: number;
}

const DAYS_OF_WEEK = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const Month: React.FC<MonthProps> = ({ currentMonth, currentYear }) => {
    const [busyDays, setBusyDays] = useState<number[][]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDay, setSelectedDay] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isBusyDaysLoading, setIsBusyDaysLoading] = useState(true);
    const [isDayActionLoading, setIsDayActionLoading] = useState(false);
    const {
        scheduledDates,
        deleteScheduledDate,
        isLoading: isScheduledDatesLoading,
    } = useEvents();

    // Format date to YYYY-MM-DD
    const formattedDate = `${currentYear}-${String(currentMonth).padStart(
        2,
        "0"
    )}-${String(selectedDay).padStart(2, "0")}`;

    // Convert scheduledDates to array of [day, month, year]
    const scheduledDays = scheduledDates.map((dateStr) => {
        const date = new Date(dateStr);
        return [
            date.getDate(),
            date.getMonth() + 1, // Add 1 since getMonth() is zero-based
            date.getFullYear(),
        ];
    });

    useEffect(() => {
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
    }, [currentMonth, currentYear]);

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

    const handleDayClick = async (day: number) => {
        setIsDayActionLoading(true);
        try {
            const dateString = `${currentYear}-${String(currentMonth).padStart(
                2,
                "0"
            )}-${String(day).padStart(2, "0")}`;
            const isScheduled = scheduledDates.includes(dateString);
            const isBusy = busyDays.some(
                ([busyDay, busyMonth, busyYear]) =>
                    day === busyDay &&
                    currentMonth === busyMonth &&
                    currentYear === busyYear
            );

            if (isScheduled) {
                setSelectedDay(day);
                setIsModalOpen(true);
                return;
            }

            if (isBusy) {
                const { error } = await supabase
                    .from("busy_days")
                    .delete()
                    .eq("day", day)
                    .eq("month", currentMonth)
                    .eq("year", currentYear);

                if (error) {
                    console.error("Error removing busy day:", error);
                } else {
                    setBusyDays(
                        busyDays.filter(
                            ([d, m, y]) =>
                                !(
                                    d === day &&
                                    m === currentMonth &&
                                    y === currentYear
                                )
                        )
                    );
                }
            } else {
                const { error } = await supabase
                    .from("busy_days")
                    .insert([{ day, month: currentMonth, year: currentYear }]);

                if (error) {
                    console.error("Error adding busy day:", error);
                } else {
                    setBusyDays([
                        ...busyDays,
                        [day, currentMonth, currentYear],
                    ]);
                }
            }
        } catch (error) {
            console.error("Error handling day click:", error);
        } finally {
            setIsDayActionLoading(false);
        }
    };

    const handleDeleteScheduledDay = async () => {
        if (selectedDay === null) return;
        await deleteScheduledDate(formattedDate);
        setIsModalOpen(false);
        setSelectedDay(null);
    };

    const renderDays = () => {
        const days = [];
        const emptyStartDays = adjustedFirstDayOfMonth;
        const emptyEndDays = 6 - adjustedLastDayOfMonth;

        // Render empty cells for start of month
        for (let i = 0; i < emptyStartDays; i++) {
            days.push(
                <div key={`empty-start-${i}`} className="p-2 m-1 rounded">
                    {" "}
                </div>
            );
        }

        // Render days of month
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
                    onClick={() => !isPast && handleDayClick(day)}
                    className={`p-2 m-1 rounded transition-colors text-center ${
                        isPast
                            ? "text-gray-600"
                            : isScheduled
                            ? "bg-yellow-500 text-gray-200 hover:bg-yellow-600 cursor-pointer"
                            : isBusy
                            ? "bg-red-700 text-gray-200 hover:bg-red-800 cursor-pointer"
                            : "hover:bg-gray-800 text-gray-200 cursor-pointer"
                    }`}
                    disabled={isPast}
                >
                    {day}
                </button>
            );
        }

        // Render empty cells for end of month
        for (let i = 0; i < emptyEndDays; i++) {
            days.push(
                <div key={`empty-end-${i}`} className="p-2 m-1 rounded">
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
        <>
            <div className="bg-gray-700 md:px-2 rounded">
                <div className="grid grid-cols-7 grid-rows-7 gap-1 text-center">
                    {DAYS_OF_WEEK.map((day) => (
                        <div
                            key={day}
                            className="p-2 font-bold text-center text-gray-300"
                        >
                            {day}
                        </div>
                    ))}
                    {isLoading || isBusyDaysLoading || isScheduledDatesLoading
                        ? Array(42)
                              .fill(0)
                              .map((_, i) => (
                                  <div
                                      key={`loading-${i}`}
                                      className="p-2 m-1 rounded flex items-center justify-center"
                                  >
                                      <CalendarDayPlaceholder />
                                  </div>
                              ))
                        : renderDays()}
                </div>
            </div>

            {isDayActionLoading && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-200"></div>
                </div>
            )}

            <ConfirmationModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedDay(null);
                }}
                onConfirm={handleDeleteScheduledDay}
                selectedDate={selectedDay ? formattedDate : ""}
                message="Are you sure you want to delete this scheduled event? This action cannot be undone."
                isLoading={isDayActionLoading}
            />
        </>
    );
};

export default Month;
