import {User} from "../model/userModel.js";
import mongoose from "mongoose";

export const create = async(req,res)=>{
    try{
         console.log("Incoming data:", req.body);

        
        const userData = new User(req.body);
        const savedData = await userData.save();

        if(!userData){
            return res.status(404).json({msg: "User data not found"});
        }

 // Convert boolean to text for API response
         const responseData = {
            ...savedData._doc,
            employeestatus: savedData.employeestatus ? "active" : "inactive"
        };
        res.status(200).json({
            msg: "User created successfully",
            data: responseData
        });

    }catch(error) {
        console.error("Error creating user:", error.message || error);
      res.status(500).json({
        msg:"Error creating user",
        error: error.message || "Internal server error"
      });  
    }
}

export const getAll = async(req,res) => {
    try {
        const userData = await User.find();
        // Map through and replace boolean with text
        const formattedUsers = userData.map(user => ({
            ...user.toObject(),
            employeestatus: user.employeestatus ? "active" : "inactive"
        }));


        res.status(200).json(formattedUsers);
    } catch (error) {
        res.status(500).json({error: error});
    }
}

export const getOne = async(req,res) => {
    try {
        const id = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ msg: "Invalid ID format" });
        }

        const userExist = await User.findById(id);
        if(!userExist){
            return res.status(404).json({msg: "User not found"});
        }

         // Convert boolean to text for API response
        const formattedUser = {
            ...userExist.toObject(),
            employeestatus: userExist.employeestatus ? "active" : "inactive"
        };

        res.status(200).json(formattedUser);

    } catch (error) {
        console.error("Error in getOne:", error);
        res.status(500).json({error: error.message || "Internal server error"});
    }
}

export const update = async (req,res) => {
    try {
        const id = req.params.id;

         if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ msg: "Invalid user ID format" });
    }
        
        console.log("Updating user with ID:", id);
        console.log("Incoming update data:", req.body);  

        const userExist = await User.findById(id);
        if(!userExist){
            return res.status(404).json({msg: "User not found"});
        }
        
        const updatedData = await User.findByIdAndUpdate(id, req.body, {new:true, runValidators:true});
        res.status(200).json(updatedData);

    } catch (error) {
        console.error("Error during update:", error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
    }

export const deleteUser = async (req,res) => {
    try {
        const id = req.params.id;
        const userExist = await User.findById(id);
        if(!userExist){
             return res.status(404).json({msg: "User not exist"});
        }
        await User.findByIdAndDelete(id);
        res.status(200).json({msg: "User deleted successfully"});
        
    } catch (error) {
        res.status(500).json({error: error});
    }
}

export const groupUsers = async (req,res) => {
    try {
        const grouped = await User.aggregate([
            {
                $group: {
                    _id: "$customergroup",
                    totalUsers: {$sum:1 },
                    activeUsers: {$sum: {$cond:["$employeestatus",1,0]}},
                    inactiveUsers: {$sum: {$cond:["$employeestatus",0,1]}}
                }
            }
        ]);
        res.json(grouped);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}