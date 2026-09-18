import "./nav-bar.css";
import Tab from "../Tab/tab";

const NavBar = (props) => {



    return (

        <div className="NavBar">
            <div className="NavHeader">Rutledge</div>

            <Tab to="/" tabName="Dashboard"/>
            <Tab to="/TimeClocking" tabName="Time Clocking"/>
            <Tab to="/Schedule" tabName="Schedule"/>
            <Tab to="/TimeOff" tabName="Time Off"/>
            <Tab to="/Admin" tabName="Admin"/>

        </div>

    );

};

export default NavBar;
