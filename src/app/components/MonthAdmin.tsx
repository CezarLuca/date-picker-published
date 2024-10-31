"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../utils/supabaseClient";

interface MonthProps {
    currentMonth: number;
    currentYear: number;
}

const DAYS_OF_WEEK = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const Month: React.FC<MonthProps> = ({ currentMonth, currentYear }) => {
    const [busyDays, setBusyDays] = useState<number[][]>([]);

    useEffect(() => {
        // Fetch busyDays from the database
        const fetchBusyDays = async () => {
            const { data, error } = await supabase
                .from("busy_days")
                .select("day, month, year")
                .eq("month", currentMonth)
                .eq("year", currentYear);
            if (error) {
                console.error("Error fetching busy days:", error);
            } else {
                // console.log(data);
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
            }
        };

        fetchBusyDays();
    }, [currentMonth, currentYear]);

    // console.log(busyDays);

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
        const isBusy = busyDays.some(
            ([busyDay, busyMonth, busyYear]) =>
                day === busyDay &&
                currentMonth === busyMonth &&
                currentYear === busyYear
        );

        if (isBusy) {
            // Remove the date from the database
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
            // Add the date to the database
            const { error } = await supabase
                .from("busy_days")
                .insert([{ day, month: currentMonth, year: currentYear }]);

            if (error) {
                console.error("Error adding busy day:", error);
            } else {
                setBusyDays([...busyDays, [day, currentMonth, currentYear]]);
            }
        }
    };

    const renderDays = () => {
        const days = [];
        const emptyStartDays = adjustedFirstDayOfMonth;
        const emptyEndDays = 6 - adjustedLastDayOfMonth;

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
        for (let day = 1; day <= daysInMonth; day++) {
            const isPast = isThisMonth && day < currentDate.getDate();
            const isBusy = busyDays.some(
                ([busyDay, busyMonth, busyYear]) =>
                    day === busyDay &&
                    currentMonth === busyMonth &&
                    currentYear === busyYear
            );
            days.push(
                <div
                    key={day}
                    className={`p-2 m-1 rounded ${
                        isPast
                            ? "bg-gray-700 text-gray-500 text-center"
                            : isBusy
                            ? "bg-red-500 text-white cursor-pointer text-center"
                            : "bg-gray-700 hover:bg-gray-600 cursor-pointer text-center"
                    }`}
                    onClick={() => !isPast && handleDayClick(day)}
                >
                    {day}
                </div>
            );
        }

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
        <div className="bg-gray-700 p-4 rounded">
            <div className="grid grid-cols-7 grid-rows-7 gap-1 justify-center items-center">
                {DAYS_OF_WEEK.map((day) => (
                    <div
                        key={day}
                        className="p-2 m-1 font-bold justify-center items-center"
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
