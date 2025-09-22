import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    employeeno:{
        type: String,
        required: true
    },
    customergroup:{
       type: String,
        required: true
    },
     jobskill:{
        type: String,
        required: true
    },
    employeestatus:{
        type: Boolean,
        required: true
    },
    projectname:{
        type: String,
        required: false
    },
    projectdescription:{
        type: String,
        required: false
    },
    projectstartdate:{
        type: Date,
        required: false
    },
    projectenddate:{
        type: Date,
        required: false
    },

});

//Schema model for login
const loginSchema = new mongoose.Schema({
    username:{type:String, required:true, unique:true},
    password:{type:String, required:true},
});

loginSchema.pre("save", async function(next){
    if(!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

export const User =  mongoose.model("User", userSchema);
export const Login =  mongoose.model("Login", loginSchema);