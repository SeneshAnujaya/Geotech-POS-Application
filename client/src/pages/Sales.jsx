import { useEffect, useState } from "react";
import MainLayout from "../components/MainLayout";
import { DataGrid } from "@mui/x-data-grid";
import { useDispatch, useSelector } from "react-redux";
import { fetchSales } from "../redux/sales/saleSlice";
import InvoiceModal from "../components/InvoiceModal";
import generatePDF from "../components/generatePDF";

const Sales = () => {
  // const [loading, setLoading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const { sales, loading, error } = useSelector((state) => state.sales);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchSales());
  }, [dispatch]);

  const rows = sales.map((sale) => ({
    id: sale.saleId,
    col1: sale.saleId,
    col2: sale.buyerName,
    col3: sale.totalAmount,
    col4: sale.user.name,
    col5: new Date(sale.createdAt).toLocaleString(),
  }));

  const columns = [
    { field: "col1", headerName: "Sale Id", width: 200 },
    { field: "col2", headerName: "Customer", width: 200 },
    { field: "col3", headerName: "Total", width: 200 },
    { field: "col4", headerName: "Cashier", width: 200 },
    { field: "col5", headerName: "Created At", width: 200 },
    {
      field: "col6",
      headerName: "Invoice",
      width: 200,
      renderCell: (params) => (
        <div className="flex items-center justify-center h-full">
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
    const selectSaleRecord = sales.find((sale) => sale.saleId === saleId);

    const invoiceItems = selectSaleRecord.SalesItem.map((item) => ({
      sku: item.product.sku,
      name: item.product.name,
      warrantyPeriod: item.product.warrantyPeriod,
      cartQuantity: item.quantity,
      retailPrice: item.price,
    }));

    const total = parseFloat(selectSaleRecord.totalAmount);
    const currentUserName = selectSaleRecord.user.name;
    const billingName = selectSaleRecord.buyerName;

    generatePDF(invoiceItems, total, currentUserName, billingName);
  };

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
      {loading ? (
        <div className="py-4 px-4">Loading...</div>
      ) : (
        <div className="px-0 md:px-8 py-4 flex flex-col">
          {/* Header bar */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold">Sale Records</h1>
          </div>

          <div style={{ width: "100%", maxWidth: "1300px" }} className="mt-8">
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

          {/* Invoice Modal */}
          <InvoiceModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
          />
        </div>
      )}
    </MainLayout>
  );
};

export default Sales;
