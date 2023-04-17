import { Link } from "react-router-dom";

function MainMenu() {
    return (
        <nav>
            <Link to="/">Main Menu</Link>
            <Link to="/rules">Rules</Link>
            <Link to="/About">About</Link>
        </nav>
    );
}

export default MainMenu;