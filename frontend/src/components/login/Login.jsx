import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css";
const Login = () => {
    const [loginForm, setLoginForm] = useState({
        username:"",
        password:"",
    });
    const navigate = useNavigate();
    const updateForm = (jsonObj) => {
        setLoginForm({...loginForm,...jsonObj});
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        const loginUser = {...loginForm};
        try{
            const response = await fetch("http://localhost:4000/login", {
                method: "POST",
                credentials: "include",
                headers:{
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(loginUser)
            });
            const data = await response.json();
            if(!response.ok){
                window.alert(data.error || "Login Failed");
                return;
            }
            setLoginForm({username: "", password: ""});
            //navigate("/home");
            window.alert(data.message || "Login Successful");
        }catch(err){
            window.alert("Error: " + err.message);
            return;
        }
    }
    return (
    <>
        <div className="login-container">
            <h1>Log In</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Username</label>
                    <input type="text" id="username" value={loginForm.username} onChange={(e) => updateForm({username: e.target.value})} required/>
                </div>
                <div className="form-group">
                    <label>Password</label>
                    <input type="password" id="password" value={loginForm.password} onChange={(e) => updateForm({password: e.target.value})} required/>
                </div>
                <button type="submit" className="login-button">Log In</button>
            </form>
            <div className="register-link">
                Don't have an account? <Link to="/register">Register here</Link>
            </div>
        </div>
    </>
    );

}
export default Login;