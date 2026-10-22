
import { useState } from "react";
import "./calendar.css";

const Calendar = () => {
    const [currentMonth, setCurrentMonth] = useState(new Date());

    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();

    const previousMonth = () => {
        setCurrentMonth(new Date(year, month - 1, 1));
    };

    const nextMonth = () => {
        setCurrentMonth(new Date(year, month + 1, 1));
    };

    return (
        <div className="calendar-container">
            <header className="calendar-header">
                <button onClick={previousMonth}>❮</button>

                <h2>
                    {currentMonth.toLocaleString("default", {
                        month: "long",
                    })}{" "}
                    {year}
                </h2>

                <button onClick={nextMonth}>❯</button>
            </header>

            <div className="calendar-grid">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                    (day) => (
                        <div className="calendar-weekday" key={day}>
                            {day}
                        </div>
                    )
                )}

                {Array.from({ length: firstDayOfMonth }, (_, i) => (
                    <div className="calendar-empty" key={`empty - ${ i }`} />
                ))}

                {Array.from({ length: daysInMonth }, (_, i) => (
                    <div className="calendar-day" key={i + 1}>
                        {i + 1}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Calendar;
