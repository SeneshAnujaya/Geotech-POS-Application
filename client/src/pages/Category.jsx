import { useEffect, useState } from "react";
import MainLayout from "../components/MainLayout";
import {
  DataGrid,
  GridActionsCellItem,
  GridRowEditStartReasons,
  GridRowEditStopReasons,
  GridRowModes,
} from "@mui/x-data-grid";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "../redux/categories/categorySlice";
import {
  DeleteIcon,
  EditIcon,
  ExternalLinkIcon,
  PenBoxIcon,
  PlusCircleIcon,
  SaveIcon,
  Trash2,
} from "lucide-react";
import CategoryModal from "../components/CategoryModal";
import {
  showErrorToast,
  showSuccessToast,
} from "../components/ToastNotification";
import axios from "axios";

const Category = () => {
  // const [loading, setLoading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editableRowId, setEditableRowId] = useState(null);
  const [editedRowData, setEditedRowData] = useState({});

  const [rowModesModel, setRowModesModel] = useState({});
  const [rows, setRows] = useState([]);

  const [uploadPercentage, setUploadPercentage] = useState(0);

  const { categories, loading, error } = useSelector(
    (state) => state.categories
  );

  const { currentUser } = useSelector(
    (state) => state.user
  );

  const role = currentUser.rest.role || 'EMPLOYEE';


  const dispatch = useDispatch();
  

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    if (categories) {
      const updatedRows = categories.map((category) => ({
        id: category.categoryId,
        col1: category.categoryId,
        col2: category.categoryPic,
        col3: category.name,
        col4: new Date(category.createdAt).toLocaleString(),
      }));
      setRows(updatedRows);
    }
  }, [categories]);

  // const rows = categories.map((category) => ({
  //   id: category.categoryId,
  //   col1: category.categoryId,
  //   col2: category.name,
  //   col3: new Date(category.createdAt).toLocaleString(),
  // }));

  
  

  const columns = [
    { field: "col1", headerName: "Id", width: 100, editable: false },
    {
      field: "col2",
      headerName: "Image",
      width: 200,
      renderCell: (params) => (
        <div className="py-3">
        <img src={`http://localhost:3000/uploads/${params.value}`} alt="category-pic" style={{width: '50px', height:'50px', borderRadius:'50%', objectFit:"cover"}}/>
        </div>
    ),
      // editable: (params) => params.row.id === editableRowId,
    },
    {
      field: "col3",
      headerName: "Category",
      width: 200,
      editable: (params) => params.row.id === editableRowId,
    },
    {
      field: "col4",
      headerName: "CreatedAt",
      width: 200,
      editable: true,
      editable: false,
    },
];

if(role === "ADMIN") {
  columns.push(
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 200,
      cellClassName: "actions",
      hide: role !== "ADMIN", 
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if(role === "ADMIN") {
        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              sx={{ color: "primary.main" }}
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              icon={<ExternalLinkIcon />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
            />,
          ];
        }
      

        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<Trash2 className="w-5 -h5 hover:text-red-700" />}
            label="Delete"
            onClick={() => handleDeleteClick(id)}
            color="inherit"
          />,
        ];
      }
      return [];
      },
    },
  )
}



  const handleCreateCategory = async (formData) => {

    const formDataObj = new FormData();
    formDataObj.append("name", formData.name);
    formDataObj.append("categoryPic", formData.categoryPic);

  
    
    
    try {
      const res = await axios.post(
        "http://localhost:3000/api/category/add",
        formDataObj,
        {
          headers: {
            "Content-Type":"multipart/form-data"
          },
          withCredentials: true,
          onUploadProgress: (progressEvent) => {
            const percentage= Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadPercentage(percentage);
          }
        },
       
      );
      const data = res.data;
      if (!data.success) {
        showErrorToast(data.message || "Error occurred");
        return;
      }
      showSuccessToast("Category created successfully!");
      setUploadPercentage(0);
      dispatch(fetchCategories());
      setIsModalOpen(false);
    } catch (error) {
      setUploadPercentage(0);
      if (error.response) {
        showErrorToast(error.response.data.message || "Server error");
      } else if (error.request) {
        showErrorToast("Network error, please try again");
      } else {
        showErrorToast("An unexpected error occurred");
      }
      setIsModalOpen(false);
    }
  };

  // console.log(uploadPercentage);
  

  const handleDeleteClick = async (id) => {
    try {
      const res = await axios.delete(
        `http://localhost:3000/api/category/deleteCategory/${id}`,  {headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
      );

      showSuccessToast("Category deleted successfully!");
      dispatch(fetchCategories());
    } catch (error) {
      if (error.response) {
        showErrorToast(error.response.data.message);
      } else {
        showErrorToast("An unexpected error occurred");
      }
    }
  };

  const handleEditClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id) => () => {
 
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
    
  };

  const handleCancelClick = (id) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = rows.find((row) => row.id === id);
    if (editedRow.isNew) {
      setRows(rows.filter((row) => row.id !== id));
    }
  };

  const processRowUpdate = async (newRow) => {
    const updatedRow = { ...newRow, isNew: false };
    setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
    
    await handleCategoryUpdateReq(updatedRow);
    
    return updatedRow;
  };

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleCategoryUpdateReq = async (updatedRow) => {

    const {id, col3} = updatedRow;
 
    try {
      const res = await axios.put(
        `http://localhost:3000/api/category/updateCategory/${id}`, {name: col3},{
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        } 
      );

      if(res.data.success) {
        showSuccessToast("Category updated successfully!");
      } else {
        showErrorToast("Failed to update category");
      }

      
    
    } catch (error) {
      
      if (error.response) {
     
        showErrorToast(error.response.data.message);
      } else if (error.request) {

        showErrorToast("No response from the server");
      } else {
        showErrorToast("An unexpected error occurred");
      }
      
    }

    
  }

  if (error || !categories) {
    return (
      <MainLayout>
        <div className=" text-red-700 py-4 px-4">Failed to get categories</div>
      </MainLayout>
    );
  }
  return (
    <MainLayout>
      {loading ? (
        <div className="py-4 px-4">Loading...</div>
      ) : (
        <div className="px-0 md:px-8 py-4 flex flex-col">
          {/* Header bar */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold">Categories</h1>
            {role == "ADMIN" && (
                <button
              className="flex items-center bg-blue-700 hover:bg-blue-700 text-gray-200 font-normal py-2 px-3 rounded-md text-md"
              onClick={() => setIsModalOpen(true)}
            >
              <PlusCircleIcon className="w-5 h-5 mr-2" />
              Add Category
            </button>
            )
            }
           
          </div>

          <div style={{ width: "100%", maxWidth: "fit-content" }} className="mt-8">
            <DataGrid
              rows={rows}
              columns={columns}
              editMode="row"
              rowModesModel={rowModesModel}
              onRowModesModelChange={handleRowModesModelChange}
              onRowEditStop={handleRowEditStop}
              processRowUpdate={processRowUpdate}
              onProcessRowUpdateError={(error) => {
                console.error("Row update error:", error);
                // Optionally, show an error toast notification
                showErrorToast("Failed to update row.");
              }}
              className="rounded-lg border !border-gray-400 !text-gray-200"
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
                '& .MuiDataGrid-cell': {
                  display: "flex",
                  alignItems: "center"
                },
              
              }}
              getRowHeight={() => 'auto'}
              // onCellEditStop={handleRowEditChange}
            />
          </div>
          {/* MODAL */}
          <CategoryModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onCreate={handleCreateCategory}
            percentage={uploadPercentage}
          />
        </div>
      )}
    </MainLayout>
  );
};

export default Category;
