import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Register.css";
const Register = () => {
    const [formData, setFormData] = useState({
        username: "",
        password: "",
    });
    const navigate = useNavigate();
    const updateForm = (jsonObj) => {
        setFormData({...formData,...jsonObj});

    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        const newUser = {...formData};
        try{
            const response = await fetch("http://localhost:4000/register", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newUser),
            });
            const data = await response.json();
            if(!response.ok){
                window.alert(data.error || "Registration Failed");
                return;
            }
            setFormData({username: "", password: ""});
            navigate("/home");
            window.alert(data.message || "Registration Successful");
        }catch(err){
            window.alert("Error: " + err.message);
            return;
        }
    }
    return(
        <>
            <div className="register-container">
            <h1>Register Here!</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Username</label>
                    <input type="text" id="username" value={formData.username} onChange={(e) => updateForm({username: e.target.value})} required className="form-input"/>
                </div>
                <div className="form-group">
                    <label>Password</label>
                    <input type="password" id="password" value={formData.password} onChange={(e) => updateForm({password: e.target.value})} required className="form-input"/>
                </div>
                <button type="submit" className="register-button">Register</button>
            </form>
            <div className="login-link">
                Already have an account? <Link to="/login">Login here</Link>
            </div>
        </div>
        </>
    );
};

export default Register;