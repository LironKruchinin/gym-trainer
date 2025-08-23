import TraineeAttendance from '@components/layout/TraineeAttendance';
import { faCalendar, faGear, faPlay, faTv } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from "react";

export default function Home() {
    const [currentTime, setCurrentTime] = useState("");

    const userOptions = [
        { title: "מסכי מתאמנים", subtitle: "הצגת כל המתאמנים בתצוגה אחידה", icon: faTv, action: () => console.log("Settings clicked"), iconColor: "#007bff" },
        { title: "מצב הפעלה אוטומטית", subtitle: "מחזוריות אוטומטית בין כל המתאמנים", icon: faPlay, action: () => console.log("Settings clicked"), iconColor: "#9238d5" },
        { title: "ניהול תוכניות", subtitle: "עריכת תוכניות אימונים ולוחות זמנים", icon: faGear, action: () => console.log("Settings clicked"), iconColor: "#1d9e59" },
    ]

    useEffect(() => {
        const updateClock = () => {
            const now = new Date();
            const timeString = now
                .toLocaleTimeString("en-GB", { hour12: false })
                .padStart(8, "0");
            setCurrentTime(timeString);
        };

        updateClock();
        const timer = setInterval(updateClock, 1000);

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="home">
            <div className="home__header">
                <h1 className="home__title">לוח בקרת אימונים</h1>
                <p className="home__subtitle">לוח הזמנים לאימונים היום</p>
                <div className="home__clock">
                    <span className="home__clock-time">{currentTime}</span>
                </div>

                <div className="home__action_cubes">
                    {userOptions.map((option, index) => (
                        <div key={index} className="home__action_cube" onClick={option.action}>
                            <FontAwesomeIcon className="icon" style={{ color: option?.iconColor }} icon={option.icon} />
                            <h3>{option.title}</h3>
                            <p>{option.subtitle}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="home__trainee_schedual container">
                <h2 className="home__trainee_schedual-title">
                    <FontAwesomeIcon className="icon" icon={faCalendar} />
                    <span className="home__trainee_schedual-title-text">לוח האימונים להיום</span>
                    </h2>
                <TraineeAttendance />
            </div>
        </div>
    );
}
