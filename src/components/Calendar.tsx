"use client";

import { useEffect, useState } from "react";
// import Month from "./OldMonth";
import MonthAdmin from "./MonthAdmin";
import MonthUser from "./MonthUser";
import { supabase } from "@/lib/utils/supabaseClient";

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
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const checkUser = async () => {
            const { data } = await supabase.auth.getSession();
            if (data.session) {
                setIsAdmin(true);
            } else {
                setIsAdmin(false);
            }
        };

        checkUser();

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange(() => {
            checkUser();
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const [months, setMonths] = useState([
        currentDate.getMonth(),
        currentDate.getMonth() + 1,
        currentDate.getMonth() + 2,
    ]);
    // const isAdmin = false;
    // const isAdmin = true;
    const handleDecrement = () => {
        setMonths(months.map((month) => month - 1));
    };
    const handleIncrement = () => {
        setMonths(months.map((month) => month + 1));
    };
    const isCurrentMonth = months[0] === new Date().getMonth();
    return (
        <div className="flex flex-wrap justify-center bg-gray-800 text-gray-200 p-2">
            <button
                className={`w-full p-2 mb-4 rounded-full ${
                    isCurrentMonth
                        ? "text-gray-500 bg-gray-700"
                        : "text-gray-200 bg-gray-600"
                }`}
                onClick={handleDecrement}
                disabled={isCurrentMonth}
            >
                &larr; Previous
            </button>
            <div className="w-full md:w-1/2 xl:w-1/3 p-2">
                <div className="bg-gray-700 p-2 rounded">
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
            <button
                className="w-full bg-gray-600 text-gray-200 rounded-full p-2 mt-4"
                onClick={handleIncrement}
            >
                Next &rarr;
            </button>
        </div>
    );
};

export default Calendar;
