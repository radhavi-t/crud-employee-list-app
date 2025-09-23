import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import "./user.css";
import { Link, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import{
    useReactTable,
    getCoreRowModel,
    getExpandedRowModel,
    getPaginationRowModel,
    flexRender,
    getFilteredRowModel,
} from "@tanstack/react-table";
import * as XLSX from "xlsx";
import {saveAs} from "file-saver";


const User = () =>{

    const [users, setUsers] = useState([]);
    const [columnFilters, setColumnFilters] = useState([]);
    const location = useLocation();
    const [groupedData, setGroupedData] = useState([]);
     const navigate = useNavigate();

    const fetchData = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get("/api/getAll",{
                headers:{Authorization:`Bearer ${token}`}
            });
            console.log("Fetched users:", response.data);
            setUsers(response.data);
        } catch (error) {
            console.error("Error fetching users:", error);
            if (error.response?.status === 401 || error.response?.status === 403){
                navigate("/login");
            }
        }
    };

    useEffect(() => {
        const token = localStorage.getItem("token");
        if(!token){
            navigate("/");
            return;
        };
        
        console.log("location.state changed:", location.state);
        fetchData();
        window.history.replaceState({}, document.title);
    }, [location.state]);

    const deleteUser = async(userId) =>{

        const userToDelete = users.find(user => user._id === userId);
        console.log(userToDelete);
        
        const token = localStorage.getItem("token"); 

        axios.delete(`/api/delete/${userId}`,{
            headers: {
            Authorization: `Bearer ${token}`  // JWT header
        }
        })
        .then((response) => {
            toast.success(response.data.msg, { position: "top-center" });
            navigate("/home", {state:{refresh: Date.now()}});
        })
        .catch((error) => {
            console.error("Error deleting user:", error);
            const errorMessage = error.response?.data?.msg || "An error occurred during deletion.";
            console.log(errorMessage)
        });
    };

    useEffect(() => {
        const token = localStorage.getItem("token"); 
        if(!token){
            navigate("/");
            return;
        };
        axios.get("/api/grouped-users",{
            headers: {
            Authorization: `Bearer ${token}`  // JWT header
        }
        })
        .then(res => setGroupedData(res.data))
        .catch(err => console.error(err));
    },[]);

    // Custom filter functions
    const boolEqFn = (row, columnId, filterValue) => {
         const raw = row.getValue(columnId); // true or false
  const status = raw ? "active" : "inactive"; // normalize

  if (!filterValue) return true; // show all if filter is empty
  return status === filterValue.toLowerCase();
    };


// Defining the columns for Tanstack table
    const columns = useMemo(()=> [
     {
      header: "",
      id: "expander",
      cell: ({ row }) =>
        row.getCanExpand() ? (
          <button onClick={row.getToggleExpandedHandler()}>
            {row.getIsExpanded() ? "-" : "+"}
          </button>
        ) : null,
    },
    {
        header: "Sr No.",
        cell: (info) => info.row.index + 1,
    },
    {
        header: "Employee Name",
        accessorKey: "name",
    },
    {
        header: "Employee No.",
        accessorKey: "employeeno",
    },
    {
        header: "Customer Group",
        accessorKey: "customergroup",
    },
    {
        header: "Job Skill",
        accessorKey: "jobskill",
    },
    {
        header: "Status",
        accessorKey: "employeestatus",
        filterFn: "equalsString" ,
        cell: (info) => {
            const value = info.getValue();
    if (value === "active") return "Active";
    if (value === "inactive") return "Inactive";
    return "N/A";
    }},
    {
        header: "Actions",
        cell: ({row}) => (
            <div className="actionButtons">
                <button onClick={() => deleteUser(row.original._id)}>
                    <i className="fa-solid fa-trash-can"></i>
                </button>
                <Link to={`/edit/${row.original._id}`}>
                    <i className="fa-solid fa-pen-to-square"></i>
                </Link>
            </div>
        ),
    },], [deleteUser]
    );

// Set up Tanstack table
    const table = useReactTable({
        data: users,
        columns,
        state: {columnFilters},
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getExpandedRowModel: getExpandedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        filterFns: {boolEq: boolEqFn}, //Custom function for filters
        getRowCanExpand: () => true,
    });

    // Expandable Row content
    const renderExpanded = (row) => (
        <div style={{textAlign: "left"}}>
            <h3>More Details</h3>
            <p><strong>Project Name</strong> {row.original.projectname || "N/A"}</p>
            <p><strong>Project Description</strong> {row.original.projectdescription || "N/A"}</p>
            <p><strong>Project Start Date:</strong> 
             {row.original.projectstartdate ? new Date(row.original.projectstartdate).toLocaleDateString() : "N/A"}
            </p>
            <p><strong>Project End Date:</strong> 
             {row.original.projectenddate ? new Date(row.original.projectenddate).toLocaleDateString() : "N/A"}
            </p>
        </div>
    );

    // Export to Excel functionality
    const exportToExcel = () => {
        const ws = XLSX.utils.json_to_sheet(users); //For creating worksheet
        const wb = XLSX.utils.book_new(); //For creating new workbook
        XLSX.utils.book_append_sheet(wb,ws,"Users");
        const wbout = XLSX.write(wb, {bookType: "xlsx", type:"array"});
        saveAs(new Blob([wbout], {type: "application/octet-stream"}), "users.xlsx");
    };

    // Filter UI helper
    function ColumnFilter ({column}) {
        if (!column.getCanFilter()) return null;
        if(!["employeestatus"].includes(column.id)){
            return(
                <input
                 placeholder="Filter…"
                 value={column.getFilterValue() ?? ""}
                 onChange={(e) => column.setFilterValue(e.target.value)}
                 style={{ width: "100%" }}
                />
            );
            }


        if (column.id === "employeestatus") {
            return (
                <select
                 value={column.getFilterValue() ?? ""}
                 onChange={(e) => column.setFilterValue(e.target.value)}
                >
                <option value="">All</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                </select>
            );
        }
    }

    const handleLogout = () =>{
        localStorage.removeItem("token");
        setUsers([]);
        setGroupedData([]);
        navigate("/");
        toast.success("Logged out successfully!", {position:"top-center"});
    }
    return(
        <div className="userTable">
        <div>
            <div className="headerSection">
                <h2>Employee List</h2>
                <p>Displaying employees from xyz app</p>
                <div style={{display:"flex", gap: "16px", marginTop: "10px"}}>
                <Link to={"/add"} className="addButton">Add User</Link>
                <button className="exportButton" onClick={exportToExcel}>Export to Excel</button>
                <button onClick={handleLogout} className="btn btn-danger">Logout</button>
                </div>
            </div>

            <table border="1" cellPadding="10" style={{ borderCollapse: "collapse", width: "100%" }}>
                <thead>
                    {table.getHeaderGroups().map((headerGroup) => (
                       <tr key={headerGroup.id}>
                          {headerGroup.headers.map((header) => (
                           <th key={header.id}>
                             {flexRender(header.column.columnDef.header, header.getContext())}
                             {header.column.getCanFilter() && (
                                <div style={{ marginTop: 6 }}>
                                   <ColumnFilter column={header.column} />
                                </div>
                             )}
                           </th>
                           ))}
                       </tr>
                    ))}
                </thead>
                <tbody>
                    {table.getRowModel().rows.map((row) => (
                       <React.Fragment key={row.id}>
                         <tr>
                           {row.getVisibleCells().map((cell) => (
                              <td key={cell.id}>
                                 {flexRender(cell.column.columnDef.cell, cell.getContext())}
                              </td>
                           ))}
                         </tr>
                          {row.getIsExpanded() && (
                            <tr>
                              <td colSpan={row.getVisibleCells().length}>{renderExpanded(row)}</td>
                            </tr>
                          )}
                       </React.Fragment>
                    ))}
                </tbody>
            </table>

            {/* Pagination Controls */}
            <div style={{display:"flex", gap: "16px", marginTop: "10px"}}>
                <button className="btn btn-primary" onClick={() => table.previousPage()} >
                    Previous
                </button>
                <span>
                    Page{table.getState().pagination.pageIndex + 1} of{" "}
                    {table.getPageCount()}
                </span>
                <button className="btn btn-primary" onClick={() => table.nextPage()} >
                    Next 
                </button>
            </div>
        </div>
        <div style={{marginTop: "24px"}}>
            <h3 style={{marginBottom:"16px"}}>Grouped User Data</h3>
            <div style={{display: "flex", flexWrap:"wrap", gap: "16px" }}>
            {groupedData.map((group)=> (
                <div key = {group._id}
                     style = {{
                        border: "1px solid #ddd",
                        borderRadius: "8px",
                        padding: "16px",
                        width: "220px",
                        boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                        backgroundColor: "white",
                     }}>
                    <h4>Customer Group:{group._id}</h4>
                    <p><strong>Total Users:</strong> {group.totalUsers}</p>
                    <p><strong>Active Users:</strong> {group.activeUsers}</p>
                    <p><strong>Inactive Users:</strong> {group.inactiveUsers}</p>
                </div>
            ))}
            </div>
        </div>
    </div>
    );
};

export default User;
