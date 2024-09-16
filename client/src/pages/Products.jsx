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
import DataTable from "../components/DataTable";

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const options = { day: "numeric", month: "long", year: "numeric" };
  return date.toLocaleDateString("en-GB", options);
};

const Products = () => {
  // const [loading, setLoading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const { products, loading, error } = useSelector((state) => state.products);

  const { currentUser } = useSelector((state) => state.user);

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
    { field: "col1", headerName: "SKU", width: 130,  editable: (params) => params.row.id === editableRowId },
    { field: "col2", headerName: "Name", width: 180,  editable: (params) => params.row.id === editableRowId },
    { field: "col3", headerName: "Cost Price - LKR", width: 130,  editable: (params) => params.row.id === editableRowId },
    { field: "col4", headerName: "Retail Price - LKR", width: 130,  editable: (params) => params.row.id === editableRowId },
    { field: "col5", headerName: "Quantity", width: 130,  editable: (params) => params.row.id === editableRowId },
    { field: "col6", headerName: "Brand", width: 150,  editable: (params) => params.row.id === editableRowId },
    { field: "col7", headerName: "Category", width: 200 },
    { field: "col8", headerName: "Warranty", width: 150,  editable: (params) => params.row.id === editableRowId, },
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
  };

  const tableApiEndpoints = {
    delete: "http://localhost:3000/api/products/delete",
    // update: "http://localhost:3000/api/user/updateuser",
  };

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
            {role == "ADMIN" && (
              <button
                className="flex items-center bg-blue-700 hover:bg-blue-700 text-gray-200 font-normal py-2 px-3 rounded-md text-md"
                onClick={() => setIsModalOpen(true)}
              >
                <PlusCircleIcon className="w-5 h-5 mr-2" />
                Add Product
              </button>
            )}
          </div>

          <div style={{ width: "100%", maxWidth:"fit-content" }} className="mt-8">
           
            <DataTable
              rows={rows}
              columns={columns}
              apiEndpoints={tableApiEndpoints}
              role={role}
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
