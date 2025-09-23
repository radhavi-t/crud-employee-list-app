import React, { useEffect, useState } from "react";
import axios from "axios";
import "./user.css";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import toast from "react-hot-toast";

const User = () =>{

    const [users, setUsers] = useState([]);
    const location = useLocation();

    const fetchData = async () => {
        try {
            const response = await axios.get("/api/getAll");
            setUsers(response.data);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [location.state]);

    const deleteUser = async(userId) =>{

        const userToDelete = users.find(user => user._id === userId);
        console.log(userToDelete);

        axios.delete(`/api/delete/${userId}`)
        .then((response) => {
            setUsers((prevUser) => prevUser.filter((user) => user._id !== userId));
            toast.success(response.data.msg, { position: "top-right" });
        })
        .catch((error) => {
            console.error("Error deleting user:", error);
            const errorMessage = error.response?.data?.msg || "An error occurred during deletion.";
            console.log(errorMessage)
        });
    };


    return (
        <div className="userTable">
            <div className="headerSection">
                <h2>Employee List</h2>
            <p>Displaying employees from xyz app</p>
             <Link to={"/add"} className="addButton">Add User</Link>
            </div>
            <table border={1} cellPadding={10} cellSpacing={0}>
                <thead>
                    <tr>
                        <th>Sr. No.</th>
                        <th>Employee Name</th>
                        <th>Employee No.</th>
                        <th>Customer Group</th>
                        <th>Primary Job Skill</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        users.map((user, index)=>{
                            return(
                                <tr key={user._id}>
                                   <td>{index+1}.</td>
                                   <td>{user.name}</td>
                                   <td>{user.employeeno}</td>
                                   <td>{user.customergroup}</td>
                                   <td>{user.jobskill}</td>
                                   <td>{user.employeestatus}</td>
                                   <td className="actionButtons">
                                       <button onClick={()=> deleteUser(user._id)}><i className="fa-solid fa-trash-can"></i></button>
                                       <Link to={`/edit/${user._id}`}><i className="fa-solid fa-pen-to-square"></i></Link>
                                   </td>
                                </tr>
                            )
                        })
                    }
                    
                </tbody>
            </table>
        </div>
    )
};

export default User;