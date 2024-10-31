"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface MonthProps {
    currentMonth: number;
    currentYear: number;
    isAdmin?: boolean;
}

const DAYS_OF_WEEK = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const Month: React.FC<MonthProps> = ({
    currentMonth,
    currentYear,
    isAdmin,
}) => {
    const router = useRouter();
    const [busyDays, setBusyDays] = useState<number[][]>([[]]);

    const currentDate = new Date();
    const isThisMonth =
        currentDate.getMonth() === currentMonth &&
        currentDate.getFullYear() === currentYear;
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
    const adjustedFirstDayOfMonth = (firstDayOfMonth + 6) % 7; // Adjust for Monday start
    const lastDayOfMonth = new Date(
        currentYear,
        currentMonth,
        daysInMonth
    ).getDay();
    const adjustedLastDayOfMonth = (lastDayOfMonth + 6) % 7; // Adjust for Monday start

    // console.log(daysInMonth, firstDayOfMonth, adjustedFirstDayOfMonth);

    const handleDayClick = (day: number) => {
        if (isAdmin) {
            setBusyDays([...busyDays, [day, currentMonth + 1, currentYear]]);
        } else {
            router.push(`/form?date=${currentYear}-${currentMonth + 1}-${day}`);
        }
    };

    const renderDays = () => {
        const days = [];
        // const emptyStartDays = (firstDayOfMonth + 6) % 7; // Adjust for Monday start
        // const emptyEndDays = (7 - lastDayOfMonth) % 7;
        const emptyStartDays = adjustedFirstDayOfMonth;
        const emptyEndDays = 6 - adjustedLastDayOfMonth;
        // console.log(emptyStartDays, emptyEndDays);

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
                    currentMonth + 1 === busyMonth &&
                    currentYear === busyYear
            );
            days.push(
                <div
                    key={day}
                    className={`p-2 m-1 rounded ${
                        isPast
                            ? "bg-gray-700 text-gray-500 text-center"
                            : isBusy
                            ? "bg-red-500 text-white cursor-not-allowed text-center"
                            : "bg-gray-700 hover:bg-gray-600 cursor-pointer text-center"
                    }`}
                    onClick={() => !isPast && !isBusy && handleDayClick(day)}
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
            {/* <h2 className="text-center mb-4">{`${
                currentMonth + 1
            }.${currentYear}`}</h2> */}

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
