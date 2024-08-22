import { useEffect, useState } from "react";
import MainLayout from "../components/MainLayout";
import { DataGrid } from "@mui/x-data-grid";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "../redux/categories/categorySlice";
import { PlusCircleIcon } from "lucide-react";
import CategoryModal from "../components/CategoryModal";
import { showErrorToast, showSuccessToast } from "../components/ToastNotification";
import axios from "axios";

const Category = () => {
  // const [loading, setLoading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const { categories, loading, error } = useSelector(
    (state) => state.categories
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const rows = categories.map((category) => ({
    id: category.categoryId,
    col1: category.categoryId,
    col2: category.name,
    col3: new Date(category.createdAt).toLocaleString(),
  }));

  const columns = [
    { field: "col1", headerName: "Id", width: 200 },
    { field: "col2", headerName: "Category", width: 200 },
    { field: "col3", headerName: "CreatedAt", width: 200 },
  ];

  const handleCreateCategory = async (formData) => {

    try {
      const res = await axios.post(
        "http://localhost:3000/api/category/add",
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
        return;
      }
      showSuccessToast("Category created successfully!");
      dispatch(fetchCategories());
    } catch (error) {
        if (error.response) {
        showErrorToast(error.response.data.message || "Server error");
      } else if (error.request) {
        showErrorToast("Network error, please try again");
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
            <button className="flex items-center bg-blue-700 hover:bg-blue-700 text-gray-200 font-normal py-2 px-3 rounded-md text-md" onClick={() => setIsModalOpen(true)}>
              <PlusCircleIcon className="w-5 h-5 mr-2"/>
              Add Category
            </button>
          </div>

          <div style={{ width: "100%", maxWidth: "800px" }} className="mt-8">
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
          <CategoryModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onCreate={handleCreateCategory}/>
        </div>
    
      )}
    </MainLayout>
  );
};

export default Category;
