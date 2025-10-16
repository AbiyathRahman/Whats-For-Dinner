import "./Button.css";
const Button = (props) => {
    return <button className="wfd-add-fav-btn" onClick={props.onClick}>{props.children}</button>;
};

export default Button;