import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import "./Add.css";

const Edit = ()=>{

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

    const {id} = useParams();
    const [user, setUser] = useState(users);
    const navigate = useNavigate(); 

    const inputChangeHandler = (e) =>{
      const { name, value } = e.target;
     setUser({
      ...user,[name]: value});
    };

    const checkboxChangeHandler = (e) => {
    const { name, checked } = e.target;
    setUser({ ...user, [name]: checked });
  };

    useEffect(() =>{
        const token = localStorage.getItem("token"); 
        axios.get(`http://localhost:8000/api/getone/${id}`,{
            headers: {
            Authorization: `Bearer ${token}`  // JWT header
        }
        })
        .then((response) => {
          console.log("Fetched user data:", response.data);
          const userData = response.data;
          const formatDate = (dateString) => {
          if (!dateString) return "";
          return new Date(dateString).toISOString().split("T")[0];
        };
        setUser({
          ...userData,
          employeestatus: Boolean(userData.employeestatus),
          projectstartdate: formatDate(userData.projectstartdate),
          projectenddate: formatDate(userData.projectenddate),
        });
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
        toast.error("Failed to fetch user data.", { position: "top-right" });
      });
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault(); // stop page refresh

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
    axios.put(`http://localhost:8000/api/update/${id}`, payload,{
            headers: {
            Authorization: `Bearer ${token}`  // JWT header
        }
        })
      .then((response) => {
        console.log("Server response after successful update:", response.data);
        toast.success(response.data.msg || "User updated successfully!", {position:"top-center"});
        navigate("/home", {state:{refresh: Date.now()}}); 
      })
      .catch((error) => {
        if (error.response) {
          console.error("Server responded with error:", error.response.data);
          const errorMessage = error.response.data.details || "An error occurred during update.";
          toast.error(error.response.data.msg || "User couldn't be updated", { position: "top-center" });
        } else if (error.request) {
          console.error("No response received from server:", error.request);
          toast.error("No response from server.", { position: "top-right" });
        } else {
          console.error("Error setting up the request:", error.message);
          toast.error("An unexpected error occurred.", { position: "top-right" });
        }
      });
    };

    return(
        <div className="addUser">
            <Link to={"/home"}>Back</Link>
            <h3>Update User</h3>
            <form className="addUserForm" onSubmit={handleSubmit}>
                <div className="inputGroup">
                    <label htmlFor="name">Employee Name</label>
                    <input type="text"  value={user.name} onChange={inputChangeHandler} id="name" name="name" autoComplete="off" placeholder="Employee Name" />
                </div>
                 <div className="inputGroup">
                    <label htmlFor="employeeno">Employee Number</label>
                    <input type="text" value={user.employeeno} onChange={inputChangeHandler} id="employeeno" name="employeeno" autoComplete="off" placeholder="Employee Number" />
                </div>
                 <div className="inputGroup">
                    <label htmlFor="customergroup">Customer Group</label>
                    <input type="text" value={user.customergroup} onChange={inputChangeHandler} id="customergroup" name="customergroup" autoComplete="off" placeholder="Customer Group" />
                </div>
                <div className="inputGroup">
                    <label htmlFor="jobskill">Job Skill</label>
                    <input type="text" value={user.jobskill} onChange={inputChangeHandler} id="jobskill" name="jobskill" autoComplete="off" placeholder="Job Skill" />
                </div>
                <div className="inputGroup">
                    <label htmlFor="projectname">Project Name</label>
                    <input type="text" value={user.projectname} onChange={inputChangeHandler} id="projectname" name="projectname" autoComplete="off" placeholder="Project Name" />
                </div>
                <div className="inputGroup">
                    <label htmlFor="projectdescription">Project Description</label>
                    <input type="text" value={user.projectdescription} onChange={inputChangeHandler} id="projectdescription" name="projectdescription" autoComplete="off" placeholder="Project Description" />
                </div>
                <div className="inputGroup">
                    <label htmlFor="projectstartdate">Project Start Date</label>
                    <input type="date" value={user.projectstartdate} onChange={inputChangeHandler} id="projectstartdate" name="projectstartdate" autoComplete="off" placeholder="Project Start Date" />
                </div>
                 <div className="inputGroup">
                    <label htmlFor="projectenddate">Project End Date</label>
                    <input type="date" value={user.projectenddate} onChange={inputChangeHandler} id="projectenddate" name="projectenddate" autoComplete="off" placeholder="Project End Date" />
                </div>
                <div className="inputGroup">
                    <label htmlFor="employeestatus">Status:Active</label>
                    <input type="checkbox" id="employeestatus" name="employeestatus"
                    checked={Boolean(user.employeestatus)}
                    onChange={checkboxChangeHandler}/>
                     {/* Debug text */}
          <div style={{ fontSize: 12, opacity: 0.7 }}>
            employeestatus: {String(user.employeestatus)}
          </div>
                </div>
                 <div className="inputGroup">
                   <button type="submit">Update User</button>
                </div>
            </form>
        </div>
    )
};

export default Edit;