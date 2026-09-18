import './App.css'
import { Routes, Route } from "react-router-dom";
import NavBar from './Components/NavBar/nav-bar';
import Home from "./Screens/Home/home";
import TimeClocking from "./Screens/TimeClocking/time-clocking";
import Schedule from "./Screens/Schedule/schedule";
import TimeOff from "./Screens/TimeOff/time-off";
import Admin from "./Screens/Admin/admin";

function App() {

    return (

        <div className="shell">
            <div className="navDiv">
                <NavBar />
            </div>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/TimeClocking" element={<TimeClocking />} />
                <Route path="/Schedule" element={<Schedule />} />
                <Route path="/TimeOff" element={<TimeOff />} />
                <Route path="/Admin" element={<Admin />} />
            </Routes>
        </div>

    );
}

export default App;
