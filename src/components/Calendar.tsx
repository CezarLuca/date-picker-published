"use client";

import { useState } from "react";
import MonthAdmin from "./MonthAdmin";
import MonthUser from "./MonthUser";
import { useAdmin } from "@/contexts/AdminContext";

const MONTH_NAMES = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];

const Calendar: React.FC = () => {
    const { isAdmin } = useAdmin();
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const [months, setMonths] = useState([
        currentDate.getMonth(),
        currentDate.getMonth() + 1,
        currentDate.getMonth() + 2,
    ]);

    const handleDecrement = () => {
        setMonths(months.map((month) => month - 1));
    };
    const handleIncrement = () => {
        setMonths(months.map((month) => month + 1));
    };

    const isCurrentMonth = months[0] === new Date().getMonth();

    return (
        <div className="flex flex-wrap justify-center bg-gray-800 text-gray-200 p-2">
            <div className="w-full md:w-1/2 xl:w-1/3 md:p-2 py-2">
                <div className="bg-gray-700 md:p-2 py-2 rounded">
                    <h2 className="text-center mb-4">{`${
                        MONTH_NAMES[months[0] % 12]
                    } ${currentYear + Math.floor(months[0] / 12)}`}</h2>
                    {isAdmin ? (
                        <MonthAdmin
                            currentMonth={(months[0] % 12) + 1}
                            currentYear={
                                currentYear + Math.floor(months[0] / 12)
                            }
                        />
                    ) : (
                        <MonthUser
                            currentMonth={(months[0] % 12) + 1}
                            currentYear={
                                currentYear + Math.floor(months[0] / 12)
                            }
                        />
                    )}
                </div>
            </div>
            <div className="w-full md:w-1/2 xl:w-1/3 p-2 hidden md:block">
                <div className="bg-gray-700 p-2 rounded">
                    <h2 className="text-center mb-4">{`${
                        MONTH_NAMES[months[1] % 12]
                    } ${currentYear + Math.floor(months[1] / 12)}`}</h2>
                    {isAdmin ? (
                        <MonthAdmin
                            currentMonth={(months[1] % 12) + 1}
                            currentYear={
                                currentYear + Math.floor(months[1] / 12)
                            }
                        />
                    ) : (
                        <MonthUser
                            currentMonth={(months[1] % 12) + 1}
                            currentYear={
                                currentYear + Math.floor(months[1] / 12)
                            }
                        />
                    )}
                </div>
            </div>
            <div className="w-full md:w-1/2 xl:w-1/3 p-2 hidden xl:block">
                <div className="bg-gray-700 p-2 rounded">
                    <h2 className="text-center mb-4">{`${
                        MONTH_NAMES[months[2] % 12]
                    } ${currentYear + Math.floor(months[2] / 12)}`}</h2>
                    {isAdmin ? (
                        <MonthAdmin
                            currentMonth={(months[2] % 12) + 1}
                            currentYear={
                                currentYear + Math.floor(months[2] / 12)
                            }
                        />
                    ) : (
                        <MonthUser
                            currentMonth={(months[2] % 12) + 1}
                            currentYear={
                                currentYear + Math.floor(months[2] / 12)
                            }
                        />
                    )}
                </div>
            </div>
            <span className="w-full flex flex-row gap-4 justify-between mt-1 mb-2 px-1 sm:px-4">
                <button
                    className={`w-40 p-2 rounded-full ${
                        isCurrentMonth
                            ? "text-gray-500 bg-gray-700"
                            : "text-gray-200 bg-gray-600"
                    }`}
                    onClick={handleDecrement}
                    disabled={isCurrentMonth}
                >
                    &larr; Previous
                </button>
                <button
                    className="w-40 bg-gray-600 text-gray-200 rounded-full p-2"
                    onClick={handleIncrement}
                >
                    Next &rarr;
                </button>
            </span>
        </div>
    );
};

export default Calendar;
