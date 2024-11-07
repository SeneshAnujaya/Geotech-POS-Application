import { useEffect, useState,Suspense, lazy  } from "react";
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
// import DataTable from "../components/DataTable";
import { useFetchProductsQuery, useCreateProductMutation } from "../redux/apiSlice";
import { CircularProgress, Box, Skeleton } from "@mui/material";

const DataTable = lazy(() => import("../components/DataTable"));

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const options = { day: "numeric", month: "long", year: "numeric" };
  return date.toLocaleDateString("en-GB", options);
};

const Products = () => {
 
  const [isModalOpen, setIsModalOpen] = useState(false);

  // const { products, loading, } = useSelector((state) => state.products);

  const {data: products = {data: []}, error, isLoading } = useFetchProductsQuery(undefined, {
  });

  const [createProduct, { isLoading: isCreating }] =
  useCreateProductMutation();


  const { currentUser } = useSelector((state) => state.user);

  const role = currentUser.rest.role;

   
    const [showLoader, setShowLoader] = useState(true);

    // Delay loader removal slightly to avoid flashing
    useEffect(() => {
      const loaderTimer = setTimeout(() => {
        if (!isLoading) setShowLoader(false);
      }, 100); 
  
      return () => clearTimeout(loaderTimer);
    }, [isLoading]);
  


  const rows = products.data.map((product) => ({
    id: product.sku,
    col1: product.sku,
    col2: product.name,
    col3: parseFloat(product.costPrice),
    col4: parseFloat(product.retailPrice),
    col5: Number(product.wholesalePrice),
    col6: Number(product.quantity),
    col7: product.brandName,
    col8: product.category.name,
    col9: product.warrantyPeriod,
    col10: formatDate(product.createdAt),
  }));

  const columns = [
    { field: "col1", headerName: "SKU", width: 130, },
    { field: "col2", headerName: "Name", width: 180,  editable: (params) => params.row.id === editableRowId },
    { field: "col3", headerName: "Cost Price - LKR", width: 130,  editable: (params) => params.row.id === editableRowId },
    { field: "col4", headerName: "Retail Price - LKR", width: 130,  editable: (params) => params.row.id === editableRowId },
    { field: "col5", headerName: "Wholesale Price - LKR", width: 130,  editable: (params) => params.row.id === editableRowId },
    { field: "col6", headerName: "Quantity", width: 100,  editable: (params) => params.row.id === editableRowId },
    { field: "col7", headerName: "Brand", width: 150,  editable: (params) => params.row.id === editableRowId },
    { field: "col8", headerName: "Category", width: 200 },
    { field: "col9", headerName: "Warranty", width: 150,  editable: (params) => params.row.id === editableRowId, },
    {
      field: "col10",
      headerName: "Created At",
      width: 200,
    },
  ];

  const handleCreateProduct = async (formData) => {
    try {
      // const res = await axios.post(
      //   "http://localhost:3000/api/products/add",
      //   formData,
      //   {
      //     headers: {
      //       "Content-Type": "application/json",
      //     },
      //     withCredentials: true,
      //   }
      // );
      const response = await createProduct(formData).unwrap();
      
      if (!response.success) {
        showErrorToast(data.message || "Error occurred");
        return;
      }
      showSuccessToast("Product is created successfully!");
    
    } catch (error) {
      if (error.data) {
        showErrorToast(
          error.data.message || "An unexpected server error occurred"
        );
      } else {
        showErrorToast("An unexpected error occurred");
      }
    }
  };

  const tableApiEndpoints = {
    delete: "http://localhost:3000/api/products/delete",
    update: "http://localhost:3000/api/products/updateproduct",
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
              height={50}
              sx={{ marginRight: 1 }}
              animation="wave"
            />
          ))}
        </Box>
      ))}
    </Box>
  );

  if (error || !products) {
    return (
      <MainLayout>
        <div className=" text-red-700 py-4 px-4">Failed to get Products</div>
      </MainLayout>
    );
  }
  return (
    <MainLayout>

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

          {showLoader || isLoading ? (  renderTableSkeleton()) :(

            <>
          <div style={{ width: "100%", maxWidth:"fit-content" }} className="mt-8">
          <Suspense fallback={<CircularProgress color="primary" />}>
            <DataTable
              rows={rows}
              columns={columns}
              apiEndpoints={tableApiEndpoints}
              role={role}
            />
            </Suspense>
          </div>
          {/* MODAL */}
          <ProductAddModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onCreate={handleCreateProduct}
          />
          </>
        )}
        </div>
  
    </MainLayout>
  );
};

export default Products;
