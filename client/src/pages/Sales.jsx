import { useEffect, useState, Suspense } from "react";
import MainLayout from "../components/MainLayout";
import { DataGrid } from "@mui/x-data-grid";
import { useDispatch, useSelector } from "react-redux";
import { fetchSales } from "../redux/sales/saleSlice";
import InvoiceModal from "../components/InvoiceModal";
import generatePDF from "../components/generatePDF";
import {
  useFetchPaginatedSalesQuery,
  useFetchSalesQuery,
} from "../redux/apiSlice";
import { Box, CircularProgress, Skeleton } from "@mui/material";

const Sales = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 50,
  });

  const {
    data: sales = { data: [] },
    error,
    isLoading,
  } = useFetchSalesQuery(undefined, {});

  const {
    data: paginatedSales = { data: [] },
    refetch,
    isLoading: isPaginatedSaleLoading,
  } = useFetchPaginatedSalesQuery({
    page: paginationModel.page,
    limit: paginationModel.pageSize,
  });  

  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    const loaderTimer = setTimeout(() => {
      if (!isLoading) setShowLoader(false);
    }, 100);

    return () => clearTimeout(loaderTimer);
  }, [isLoading]);

  const rows = [...paginatedSales.data]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .map((sale) => ({
      id: sale.saleId,
      col1: sale.invoiceNumber,
      col2: sale.buyerName,
      col3: sale.phoneNumber,
      col4: sale.totalAmount,
      col5: sale.discount,
      col6: sale.totalAmount - sale.discount,
      col7: sale.paidAmount,
      col8: sale.paymentStatus,
      col9: sale.user?.name || sale.cashierName || "N/A",
      col10: new Date(sale.createdAt).toLocaleString(),
    }));

  const columns = [
    { field: "col1", headerName: "Invoice Number", width: 200 },
    { field: "col2", headerName: "Customer", width: 150 },
    { field: "col3", headerName: "Phone Number", width: 150 },
    { field: "col4", headerName: "Amount", width: 120 },
    { field: "col5", headerName: "Discount", width: 100 },
    { field: "col6", headerName: "Total", width: 100 },
    { field: "col7", headerName: "Paid", width: 120 },
    {
      field: "col8",
      headerName: "Status",
      width: 150,
      renderCell: (params) => (
        <div className="flex items-center  h-full">
          <button
            variant="contained"
            color="primary"
            className={`bg-blue-800 flex rounded-full h-[22px] pt-0.5 items-center px-3 text-[11px] font-bold leading-none ${
              params.value === "FULL PAID"
                ? "bg-green-700"
                : params.value === "UNPAID"
                ? "bg-red-700"
                : "bg-orange-600"
            }`}
          >
            {params.value}
          </button>
        </div>
      ),
    },
    { field: "col9", headerName: "Cashier", width: 150 },
    { field: "col10", headerName: "Created At", width: 200 },
    {
      field: "col11",
      headerName: "Invoice",
      width: 200,
      renderCell: (params) => (
        <div className="flex items-center h-full">
          <button
            variant="contained"
            color="primary"
            className="bg-blue-800 flex rounded-full h-6 items-center px-3"
            onClick={() => handleInvoice(params.row.id)}
          >
            Invoice
          </button>
        </div>
      ),
    },
  ];

  const handleInvoice = (saleId) => {
    const selectSaleRecord = paginatedSales.data.find(
      (sale) => sale.saleId === saleId
    );

    const invoiceItems = selectSaleRecord.SalesItem.map((item) => ({
      sku: item.product.sku,
      name: item.product.name,
      warrantyPeriod: item.product.warrantyPeriod,
      cartQuantity: item.quantity,
      price: item.price,
    }));

    const total = parseFloat(selectSaleRecord.totalAmount);
    const currentUserName =
      selectSaleRecord.user?.name || selectSaleRecord.cashierName || "N/A";
    const billingName = selectSaleRecord.buyerName;
    const phoneNumber = selectSaleRecord.phoneNumber;
    const discount = selectSaleRecord.discount;
    const grandTotal = total - discount;
    const paidAmount = selectSaleRecord.paidAmount;
    const invoiceNumber = selectSaleRecord.invoiceNumber;

    generatePDF(
      invoiceItems,
      total,
      currentUserName,
      billingName,
      phoneNumber,
      null,
      discount,
      grandTotal,
      paidAmount,
      invoiceNumber
    );
  };

  const renderTableSkeleton = () => (
    <Box sx={{ width: "100%", maxWidth: "fit-content" }} className="mt-8">
      {Array.from(new Array(6)).map((_, rowIndex) => (
        <Box key={rowIndex} display="flex" alignItems="center" mb={1}>
          {Array.from(new Array(7)).map((_, colIndex) => (
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

  if (error || !sales) {
    return (
      <MainLayout>
        <div className=" text-red-700 py-4 px-4">
          Failed to get sales records
        </div>
      </MainLayout>
    );
  }
  return (
    <MainLayout>
      <div className="px-0 md:px-8 py-4 flex flex-col">
        {/* Header bar */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Sale Records</h1>
        </div>

        {showLoader || isLoading ? (
          renderTableSkeleton()
        ) : (
          <>
            <div
              style={{
                width: "100%",
                maxWidth: "fit-content",
                height: "680px",
              }}
              className="mt-8"
            >
              <Suspense fallback={<CircularProgress color="primary" />}>
                <DataGrid
                  rows={rows}
                  columns={columns}
                  className="text-white! rounded-lg border !border-gray-400 !text-gray-200"
                  sx={{
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
                  pagination={true}
                  paginationMode="server"
                  rowCount={paginatedSales.total || 0}
                  paginationModel={paginationModel}
                  onPaginationModelChange={(newModel) =>
                    setPaginationModel(newModel)
                  }
                  loading={isPaginatedSaleLoading}
                />
              </Suspense>
            </div>

            {/* Invoice Modal */}
            <InvoiceModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
            />
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default Sales;
