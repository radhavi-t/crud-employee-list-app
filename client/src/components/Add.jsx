import React, {useState} from "react";
import "./Add.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const Add = () =>{   //Initial empty user object
    const users = {
        name:"",
        employeeno:"",
        customergroup:"",
        jobskill:"",
        employeestatus: false,
        projectname:"",
        projectdescription:"",
        projectstartdate: "",
        projectenddate: "",
    }

    // State for storing the form data
    const [user, setUser] = useState(users);
    const [successmsg, setSuccessMsg] = useState("");
    const navigate = useNavigate();  // To redirect to homepage from Add user page
  // Handle input changes
const inputHandler = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const checkboxHandler = (e) => {
    setUser({ ...user, employeestatus: e.target.checked });
  };

//Handle form submission
    const submitForm = async (e) => {
        e.preventDefault(); // Stop page refresh

          const payload = {
        ...user,
        projectstartdate: user.projectstartdate
        ? new Date(user.projectstartdate)
        : null,
        projectenddate: user.projectenddate
        ? new Date(user.projectenddate)
        : null,
    };
        const token = localStorage.getItem("token"); 
        
        axios.post("http://localhost:8000/api/create", payload,{
            headers: {
            Authorization: `Bearer ${token}`  // JWT header
        }
        })
        .then((response) =>{
            setSuccessMsg(response.data.msg);
           toast.success(response.data.msg, {position:"top-center"});
           setUser(users);
          setTimeout(() => {
            navigate("/home", { state: { refresh: true } })
          }, 1500); 
        }) 
        .catch((error) => {
            console.log("Error creating user");
            console.log(error.message);
            toast.error(error.response.data.msg, {position:"top-center"});
        });
    }

    
    return(
        <div className="addUser">
            <Link to={"/home"}>Back</Link>
            <h3>Add New User</h3>
            <form className="addUserForm" onSubmit={submitForm}>
                <div className="inputGroup">
                    <label htmlFor="name">Employee Name</label>
                    <input type="text" onChange={inputHandler} id="name" name="name" autoComplete="off" placeholder="Employee Name" />
                </div>
                 <div className="inputGroup">
                    <label htmlFor="employeeno">Employee Number</label>
                    <input type="text" onChange={inputHandler} id="employeeno" name="employeeno" autoComplete="off" placeholder="Employee Number" />
                </div>
                 <div className="inputGroup">
                    <label htmlFor="customergroup">Customer Group</label>
                    <input type="text" onChange={inputHandler} id="customergroup" name="customergroup" autoComplete="off" placeholder="Customer Group" />
                </div>
                <div className="inputGroup">
                    <label htmlFor="jobskill">Job Skill</label>
                    <input type="text" onChange={inputHandler} id="jobskill" name="jobskill" autoComplete="off" placeholder="Job Skill" />
                </div>
                <div className="inputGroup">
                    <label htmlFor="projectname">Project Name</label>
                    <input type="text" onChange={inputHandler} id="projectname" name="projectname" autoComplete="off" placeholder="Project Name" />
                </div>
                <div className="inputGroup">
                    <label htmlFor="projectdescription">Project Description</label>
                    <textarea onChange={inputHandler} id="projectdescription" name="projectdescription" autoComplete="off" placeholder="Project Description" />
                </div>
                <div className="inputGroup">
                    <label htmlFor="projectstartdate">Project Start Date</label>
                    <input type="date" onChange={inputHandler} id="projectstartdate" name="projectstartdate" autoComplete="off" placeholder="Project Start Date" />
                </div>
                 <div className="inputGroup">
                    <label htmlFor="projectenddate">Project End Date</label>
                    <input type="date" onChange={inputHandler} id="projectenddate" name="projectenddate" autoComplete="off" placeholder="Project End Date" />
                </div>
                <div className="inputGroup">
                    <label htmlFor="employeestatus">Status:Active</label>
                    <input type="checkbox" id="employeestatus" name="employeestatus" 
                    checked={Boolean(user.employeestatus)}
                    onChange={checkboxHandler}/>
                    {/* Debug text */}
          <div style={{ fontSize: 12, opacity: 0.7 }}>
            employeestatus: {String(user.employeestatus)}
          </div>
                </div>
                 <div className="inputGroup">
                   <button type="submit">Add User</button>
                </div>
            </form>
        </div>
    )
}

export default Add;