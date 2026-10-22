import "./home.css";
import Calendar from "../../Components/Calendar/calendar.jsx";

const Home = () => {
    return (
        <div className="screenParentDiv">
            <h1>Welcome, Taelyn!</h1>

            <div className="dashboard-layout">
                <section className="calendar-panel">
                    <Calendar />
                </section>

                <section className="my-hours">
                    <h2>My Hours:</h2>

                    <div className="pay-section">
                        <h3>This week (Oct 3 - 16)</h3>
                        <p>Entered: 2.50</p>
                    </div>

                    <div className="pay-section">
                        <h3>Last Week (Sep 26 - Oct 2)</h3>
                        <p>Entered: 29.00</p>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Home;
