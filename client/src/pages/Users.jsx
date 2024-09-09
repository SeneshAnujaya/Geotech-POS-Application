import React, { useEffect } from 'react';
import MainLayout from '../components/MainLayout';
import { useState } from 'react';
import axios from "axios";
import { showErrorToast, showSuccessToast } from '../components/ToastNotification';
import { PlusCircleIcon } from 'lucide-react';
import {
  DataGrid, GridActionsCellItem,
} from "@mui/x-data-grid";
import UserAddModal from "../components/UserAddModal";

const Users = () => {
  const [users, setusers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getusers = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:3000/api/auth/getusers');
      
      if(res.data.success) {
        setLoading(false);
        const users = res.data.data;
        setusers(users)
      } else {
        showErrorToast("Failed to get users");
      }

          
    } catch (error) {   
      setLoading(false);   
      showErrorToast("server Error");
    }
  }

  useEffect(() => {
    getusers();
  },[]);

  // DATA GRID ROWS COLUMNS
  const rows = users.map((user) => ({
    id: user.id,
    col1: user.id,
    col2: user.name,
    col3: user.email,
    col4: user.role,
    col5: new Date(user.createdAt).toLocaleString(),
    col6: new Date(user.updatedAt).toLocaleString(),
  }));

  const columns = [
    { field: "col1", headerName: "Id", width: 100, editable: false },
    {
      field: "col2",
      headerName: "Name",
      width: 200,
    },
    {
      field: "col3",
      headerName: "Email",
      width: 200,
    },
    {
      field: "col4",
      headerName: "Role",
      width: 200,
    },
    {
      field: "col5",
      headerName: "CreatedAt",
      width: 200,
    },
    {
      field: "col6",
      headerName: "UpdatedAt",
      width: 200,
    },

  ];

  const handleCreateUser = async (formData) => {
    setLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:3000/api/auth/signup",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = res.data;
      if (!data.success) {
        showErrorToast(data.message || "Error occurred");
        setLoading(false);
        return;
      }
      setLoading(false);
      showSuccessToast("Account created successfully!");
    } catch (error) {
      console.log(error);
      
      if (error.response) {
        // Handle server-side errors
        showErrorToast(error.response.data.message || "Server error");
      } else if (error.request) {
        // Handle network errors
        showErrorToast("Network error, please try again");
      } else {
        // Handle other errors
        showErrorToast("An unexpected error occurred");
      }
      setLoading(false);
    }
  }


  return (
    <MainLayout>
      {loading ? (
        <div className="py-4 px-4">Loading...</div>
      ) : (
        <div className="px-0 md:px-8 py-4 flex flex-col">
          {/* Header bar */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold">Users</h1>
            <button
              className="flex items-center bg-blue-700 hover:bg-blue-700 text-gray-200 font-normal py-2 px-3 rounded-md text-md"
              onClick={() => setIsModalOpen(true)}
            >
              <PlusCircleIcon className="w-5 h-5 mr-2" />
              Add user
            </button>
          </div>

          <div style={{ width: "100%", maxWidth:"1200px" }} className="mt-8">
            <DataGrid
              rows={rows}
              columns={columns}
              className="text-white! rounded-lg border !border-gray-400 !text-gray-200"
              sx={{
                // Style for cells
                // "& .MuiDataGrid-cell": {
                //   color: "#fff", // Text color for cells
                // },
                // Style for column headers
                "& .MuiDataGrid-columnHeaders": {
                  backgroundColor: "transparent", // Background color for header
                  color: "#fff", // Text color for header
                },
                // Style for virtual scroller (rows area)
                "& .MuiDataGrid-virtualScroller": {
                  backgroundColor: "transparent", // Background color for rows
                },
                // Style for footer container
                "& .MuiDataGrid-footerContainer": {
                  backgroundColor: "transparent", // Background color for footer
                },
                // Style for footer cells
                "& .MuiDataGrid-footerCell": {
                  color: "#fff", // Text color for footer cells
                },
                // Style for toolbar container
                "& .MuiDataGrid-toolbarContainer": {
                  backgroundColor: "transparent", // Background color for toolbar
                },
                // Style for checkbox color
                "& .MuiCheckbox-root": {
                  color: "#fff", // Checkbox color
                },
                // Style for icons (like pagination and filtering icons)
                "& .MuiDataGrid-iconSeparator": {
                  color: "#fff", // Color for separator icon
                },
                "& .MuiDataGrid-iconButton": {
                  color: "#fff", // Color for icon buttons (e.g., pagination controls)
                },
                // Style for pagination controls
                "& .MuiPaginationItem-root": {
                  color: "#fff", // Color for pagination item text
                },
              }}
            />
          </div>
          {/* MODAL */}
          <UserAddModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onCreate={handleCreateUser}
          />
        </div>
      )}
    </MainLayout>
  )
}

export default Users