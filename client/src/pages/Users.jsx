import React, { useEffect }  from "react";
import MainLayout from "../components/MainLayout";
import { Suspense, useState } from "react";
import axios from "axios";
import {
  showErrorToast,
  showSuccessToast,
} from "../components/ToastNotification";
import {  PlusCircleIcon } from "lucide-react";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import UserAddModal from "../components/UserAddModal";
import DataTable from "../components/DataTable";
import { useSelector } from "react-redux";
import { useFetchUsersQuery, useCreateUserMutation, useDeleteUserMutation, useUpdateUserMutation } from "../redux/apiSlice";
import { Box, CircularProgress, Skeleton } from "@mui/material";

const Users = () => {

  const [isModalOpen, setIsModalOpen] = useState(false);

  const {data: users = {data: []}, error, isLoading, refetch } = useFetchUsersQuery(undefined, {
    
  });

 

  const [createUser, { isLoading: isCreating }] =
  useCreateUserMutation();
  
  const [deleteUser, {isLoading: isDeleting}] = useDeleteUserMutation();
  const [updateuser, {isLoading: isUpdating}] = useUpdateUserMutation();

  const { currentUser } = useSelector((state) => state.user);
   const role = currentUser.rest.role;

   const [showLoader, setShowLoader] = useState(true);

   useEffect(() => {
     const loaderTimer = setTimeout(() => {
       if (!isLoading) setShowLoader(false);
     }, 100); 
 
     return () => clearTimeout(loaderTimer);
   }, [isLoading]);

  // const getusers = async () => {
  //   setLoading(true);
  //   try {
  //     const res = await axios.get("http://localhost:3000/api/user/getusers");

  //     if (res.data.success) {
  //       setLoading(false);
  //       const users = res.data.data;
  //       // setusers(users);
  //     } else {
  //       showErrorToast("Failed to get users");
  //     }
  //   } catch (error) {
  //     setLoading(false);
  //     showErrorToast("server Error");
  //   }
  // };



  // DATA GRID ROWS COLUMNS
  const rows = users.data.map((user) => ({
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

  // const tableApiEndpoints = {
  //   delete: "http://localhost:3000/api/user/deleteuser",
  //   update: "http://localhost:3000/api/user/updateuser",
  // };

  const handleCreateUser = async (formData) => {
    // setLoading(true);
    try {
      // const res = await axios.post(
      //   "http://localhost:3000/api/auth/signup",
      //   formData,
      //   {
      //     headers: {
      //       "Content-Type": "application/json",
      //     },
      //     withCredentials: true,
      //   }
      // );
      const response = await createUser(formData).unwrap();

      if (!response.success) {
        showErrorToast(data.message || "Error occurred");
        return;
      }
    
      
      showSuccessToast("Account created successfully!");
      refetch();
    } catch (error) {
      console.log(error);

      if (error.data) {
        showErrorToast(
          error.data.message || "An unexpected server error occurred"
        );
      } else {
        showErrorToast("An unexpected error occurred");
      }
    }
  };

  const renderTableSkeleton = () => (
    <Box sx={{ width: "100%", maxWidth: "fit-content" }} className="mt-8">
      {Array.from(new Array(4)).map((_, rowIndex) => (
        <Box key={rowIndex} display="flex" alignItems="center" mb={1}>
          {Array.from(new Array(5)).map((_, colIndex) => (
            <Skeleton
              key={colIndex}
              variant="rounded"
              width={300} 
              height={60}
              sx={{ marginRight: 1 }}
              animation="wave"
            />
          ))}
        </Box>
      ))}
    </Box>
  );

  return (
    <MainLayout>
    
        <div className="px-0 md:px-8 py-4 flex flex-col">
          {/* Header bar */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold">Users</h1>
            {role == "ADMIN" && (
              <button
                className="flex items-center bg-blue-700 hover:bg-blue-700 text-gray-200 font-normal py-2 px-3 rounded-md text-md"
                onClick={() => setIsModalOpen(true)}
              >
                <PlusCircleIcon className="w-5 h-5 mr-2" />
                Add user
              </button>
            )}
          </div>

          {showLoader || isLoading ? (  renderTableSkeleton()) :( 
            <>
          <div>
            <div className="w-full max-w-fit mt-8">
            <Suspense fallback={<CircularProgress color="primary" />}>
              <DataTable
                rows={rows}
                columns={columns}
                // apiEndpoints={tableApiEndpoints}
                role={role}
                deleteRow={deleteUser}
                updateRow={updateuser}
              />
              </Suspense>
            </div>
          </div>
          {/* MODAL */}
          <UserAddModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onCreate={handleCreateUser}
          />
          </>
          )}
        </div>
     
    </MainLayout>
  );
};

export default Users;
