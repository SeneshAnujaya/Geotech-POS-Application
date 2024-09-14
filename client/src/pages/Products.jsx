import { useEffect, useState } from "react";
import MainLayout from "../components/MainLayout";
import { DataGrid } from "@mui/x-data-grid";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../redux/products/productsSlice";
import { PlusCircleIcon } from "lucide-react";
import {
  showErrorToast,
  showSuccessToast,
} from "../components/ToastNotification";
import axios from "axios";
import ProductAddModal from "../components/ProductAddModal";

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const options = { day: 'numeric', month: 'long', year: 'numeric' };
  return date.toLocaleDateString('en-GB', options);
};

const Products = () => {
  // const [loading, setLoading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const { products, loading, error } = useSelector((state) => state.products);

  const { currentUser } = useSelector(
    (state) => state.user
  );

  const role = currentUser.rest.role;

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);
  

  const rows = products.map((product) => ({
    id: product.sku,
    col1: product.sku,
    col2: product.name,
    col3: parseFloat(product.costPrice),
    col4: parseFloat(product.retailPrice),
    col5: Number(product.quantity),
    col6: product.brandName,
    col7: product.category.name,
    col8: product.warrantyPeriod,
    col9: formatDate(product.createdAt),
  }));

  const columns = [
    { field: "col1", headerName: "SKU", width: 130 },
    { field: "col2", headerName: "Name", width: 180 },
    { field: "col3", headerName: "Cost Price - LKR", width: 130 },
    { field: "col4", headerName: "Retail Price - LKR", width: 130 },
    { field: "col5", headerName: "Quantity", width: 130 },
    { field: "col6", headerName: "Brand", width: 150 },
    { field: "col7", headerName: "Category", width: 200 },
    { field: "col8", headerName: "Warranty", width: 150 },
    {
      field: "col9",
      headerName: "Created At",
      width: 200,
    },
  ];

  const handleCreateProduct = async (formData) => {

   
   

    try {
      const res = await axios.post(
        "http://localhost:3000/api/products/add",
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
      showSuccessToast("Product is created successfully!");
      dispatch(fetchProducts());
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

  if (error || !products) {
    return (
      <MainLayout>
        <div className=" text-red-700 py-4 px-4">Failed to get Products</div>
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
            <h1 className="text-2xl font-semibold">Products</h1>
            { role == "ADMIN" && (
             <button
              className="flex items-center bg-blue-700 hover:bg-blue-700 text-gray-200 font-normal py-2 px-3 rounded-md text-md"
              onClick={() => setIsModalOpen(true)}
            >
              <PlusCircleIcon className="w-5 h-5 mr-2" />
              Add Product
            </button>
            )
            
            }
              
          </div>

          <div style={{ width: "100%" }} className="mt-8">
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
          <ProductAddModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onCreate={handleCreateProduct}
          />
        </div>
      )}
    </MainLayout>
  );
};

export default Products;
