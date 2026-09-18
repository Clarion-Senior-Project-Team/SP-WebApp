import "./tab.css";
import { NavLink } from "react-router-dom";

const Tab = (props) => {

    return (
        <NavLink to={props.to} className={({ isActive }) => "nav-tab" + (isActive ? "-active" : "")}>
            {props.tabName}
        </NavLink>
    );
};

export default Tab;
