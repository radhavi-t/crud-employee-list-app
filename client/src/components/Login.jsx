import React, {useState} from "react";
import "./Login.css";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const Login = () =>{
    const [form, setForm] = useState({username:"", password:""});
    const navigate = useNavigate();

    const handleChange = (e) =>{
        setForm({...form,[e.target.name]:e.target.value});
    };

    const handleSubmit = async (e) =>{
        e.preventDefault();
        try {
            const res = await axios.post("http://localhost:8000/api/login",form);
            localStorage.setItem("token", res.data.token); //saving the JWT
            alert("Login successful!");
            navigate("/home"); //redirect to login
        } catch (err) {
            alert(err.response?.data?.msg || "Login failed");
        } 
    };

    return(
        <div className="login">
            <h3>Login</h3>
            <form className="loginform" onSubmit={handleSubmit}>
                <div className="inputgroup">
                     <input type="text" name="username" placeholder="Username" onChange={handleChange}/>
                </div>
                <div className="inputgroup">
                     <input type="password" name="password" placeholder="Password" onChange={handleChange}/>
                </div>
                <div className="inputgroup">
                     <button type="submit">Login</button>
                </div>
                <div className="inputgroup">
                     <Link to={"/"}>Not registered?Click here</Link>
                </div>
            </form>
        </div>
    );
};


export default Login;