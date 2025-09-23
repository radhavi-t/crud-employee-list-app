import React, {useState} from "react";
import "./SignUp.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SignUp = () =>{
    const [form, setForm] = useState({username:"", password:""});
    const navigate = useNavigate();

    const handleChange = (e) =>{
        setForm({...form,[e.target.name]:e.target.value});
    };

    const handleSubmit = async (e) =>{
        e.preventDefault();
        try {
            axios.post("/api/signup",form);
            alert("Signup successful!Please login.");
            navigate("/"); //redirect to login
        } catch (err) {
            alert(err.response?.data?.msg || "Signup failed");
        } 
    };

    return(
        <div className="signup"> 
            <h3>Signup</h3>
            <form className= "signupform" onSubmit={handleSubmit}>
                <div className="inputgroup">
                   <input type="text" name="username" placeholder="Username" onChange={handleChange}/>
                </div>
                <div className="inputgroup">
                   <input type="text" name="password" placeholder="Password" onChange={handleChange}/>
                </div>
                <div className="inputgroup">
                   <button type="submit">Signup</button>
                </div>
            </form>
        </div>
    );
};


export default SignUp;
