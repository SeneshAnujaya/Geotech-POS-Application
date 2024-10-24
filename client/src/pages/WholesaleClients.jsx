import React, { useEffect } from "react";
import MainLayout from "../components/MainLayout";
import { useState } from "react";
import axios from "axios";
import {
  showErrorToast,
  showSuccessToast,
} from "../components/ToastNotification";
import { PlusCircleIcon } from "lucide-react";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import DataTable from "../components/DataTable";
import { useSelector } from "react-redux";
import WholesaleClientAddModal from "../components/WholesaleClientAddModal";

const WholesaleClients = () => {
  const [users, setusers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { currentUser } = useSelector((state) => state.user);

  const role = currentUser.rest.role;

  const getusers = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:3000/api/user/getusers");

      if (res.data.success) {
        setLoading(false);
        const users = res.data.data;
        setusers(users);
      } else {
        showErrorToast("Failed to get users");
      }
    } catch (error) {
      setLoading(false);
      showErrorToast("server Error");
    }
  };

  useEffect(() => {
    getusers();
  }, []);

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
      editable: (params) => params.row.id === editableRowId,
    },
    {
      field: "col3",
      headerName: "Email",
      width: 200,
      editable: (params) => params.row.id === editableRowId,
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

  const tableApiEndpoints = {
    delete: "http://localhost:3000/api/user/deleteuser",
    update: "http://localhost:3000/api/user/updateuser",
  };

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
          withCredentials: true,
        }
      );
      const data = res.data;
      if (!data.success) {
        showErrorToast(data.message || "Error occurred");
        setLoading(false);
        return;
      }
      setLoading(false);
      getusers();
      showSuccessToast("Account created successfully!");
    } catch (error) {
      console.log(error);

      if (error.response) {
        showErrorToast(error.response.data.message || "Server error");
      } else if (error.request) {
        showErrorToast("Network error, please try again");
      } else {
        showErrorToast("An unexpected error occurred");
      }
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      {loading ? (
        <div className="py-4 px-4">Loading...</div>
      ) : (
        <div className="px-0 md:px-8 py-4 flex flex-col border-slate-700 rounded-md border min-h-[800px]">
          {/* Header bar */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold">Wholesale Clients</h1>
            {role == "ADMIN" && (
              <button
                className="flex items-center bg-blue-700 hover:bg-blue-700 text-gray-200 font-normal py-2 px-3 rounded-md text-md"
                onClick={() => setIsModalOpen(true)}
              >
                <PlusCircleIcon className="w-5 h-5 mr-2" />
                Add Client
              </button>
            )}
          </div>

          <div>
            <div className="w-full max-w-fit mt-8">
              <DataTable
                rows={rows}
                columns={columns}
                apiEndpoints={tableApiEndpoints}
                role={role}
              />
            </div>
          </div>
          {/* MODAL */}
          <WholesaleClientAddModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onCreate={handleCreateUser}
          />
        </div>
      )}
    </MainLayout>
  );
};

export default WholesaleClients;
