import './Header.css';

const Header = (props) => {
    return (
        <header className="wfd-header">
            <h1 className="wfd-welcome">Hey {props.username}, What are you craving today?</h1>
            <button className="wfd-logout-btn" onClick={props.onLogout}>Logout</button>
        </header>
    );
};

export default Header;