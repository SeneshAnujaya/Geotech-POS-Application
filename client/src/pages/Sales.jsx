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
    col1: sale.invoiceNumber,
    col2: sale.buyerName,
    col3: sale.phoneNumber,
    col4: sale.totalAmount,
    col5: sale.discount,
    col6: (sale.totalAmount - sale.discount),
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
    { field: "col8", headerName: "Status", width: 150,  renderCell: (params) => (
      <div className="flex items-center  h-full">
      <button
        variant="contained"
        color="primary"
        className={`bg-blue-800 flex rounded-full h-[22px] pt-0.5 items-center px-3 text-[11px] font-bold leading-none ${params.value === "FULL PAID" ? 'bg-green-700' : params.value === "UNPAID" ? 'bg-red-700' : 'bg-orange-600'}`}
      >
        {params.value}
      </button>
    </div>
    ), },
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
    const selectSaleRecord = sales.find((sale) => sale.saleId === saleId);

    const invoiceItems = selectSaleRecord.SalesItem.map((item) => ({
      sku: item.product.sku,
      name: item.product.name,
      warrantyPeriod: item.product.warrantyPeriod,
      cartQuantity: item.quantity,
      price: item.price,
    }));

    const total = parseFloat(selectSaleRecord.totalAmount);
    const currentUserName = selectSaleRecord.user?.name || selectSaleRecord.cashierName || "N/A";
    const billingName = selectSaleRecord.buyerName;
    const phoneNumber = selectSaleRecord.phoneNumber;
    const discount = selectSaleRecord.discount;
    const grandTotal = total - discount; 
    const paidAmount = selectSaleRecord.paidAmount;
    const invoiceNumber = selectSaleRecord.invoiceNumber;
  
    

    
    

    generatePDF(invoiceItems, total, currentUserName, billingName, phoneNumber,null, discount, grandTotal, paidAmount, invoiceNumber);
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

          <div style={{ width: "100%", maxWidth: "fit-content", height: "700px" }} className="mt-8">
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
