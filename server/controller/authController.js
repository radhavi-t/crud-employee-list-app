import {Login} from "../model/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

//Sign Up
export const signupUser = async (req,res) => {
    try {
        const {username, password} = req.body; 
        const existing = await Login.findOne({username});
        if(existing) return res.status(400).json({msg: "User already exists"});
        
        const newUser = new Login({username, password});
        await newUser.save();

        res.status(201).json({msg:"User created successfully"});
    } catch (err) {
        res.status(500).json({msg:"Server error", error:err.message});
    }
}

//Login
export const loginUser = async (req,res) => {
    try {
        const {username, password} = req.body;
        console.log("Login attempt", username, password);

        const user = await Login.findOne({username});
        console.log("User found", user);

        if (!user) return res.status(400).json({msg:"user not found"});

        const isMatch = await bcrypt.compare(password, user.password);
        console.log("Password matches", isMatch);

        if(!isMatch) return res.status(400).json({msg:"Invalid password"});

        const token = jwt.sign(
           {id: user._id, username: user.username},
           process.env.JWT_SECRET,
           {expiresIn:"1h"}
        );

        res.json({token});
    } catch (err) {
        console.log("login error", err.message);
        res.status(500).json({msg: "server error", error: err.message});
    }
    
};
