import {
  ChartLine,
  ChartNoAxesCombined,
  CircleDollarSign,
  CirclePercent,
} from "lucide-react";
import MainLayout from "../components/MainLayout";
import IconCard from "../components/IconCard";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { fetchSales } from "../redux/sales/saleSlice";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";

const getLast14DaysSales = (sales) => {
  const today = new Date();
  const past14Days = new Date(today);
  past14Days.setDate(today.getDate() - 58);

  return sales.filter((sale) => {
    const saleDate = new Date(sale.createdAt);
    return saleDate >= past14Days && saleDate <= today;
  });
};

const aggregateSalesByDate = (sales) => {
  const salesByDate = {};

  sales.forEach((sale) => {
    const saleDate = new Date(sale.createdAt).toLocaleDateString();
    const saleAmount = parseFloat(sale.totalAmount);

    if (!salesByDate[saleDate]) {
      salesByDate[saleDate] = 0;
    }

    salesByDate[saleDate] += saleAmount;
  });

  return Object.keys(salesByDate).map((date) => ({
    date,
    amount: salesByDate[date],
  }));
};

const Dashboard = () => {
  const { sales, loading, error } = useSelector((state) => state.sales);
  const dispatch = useDispatch();
  const [salesData, setSalesData] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalSalesCount, setTotalSalesCount] = useState(0);
  const [dailyRevenue, setDailyRevenue] = useState(0);
  const [monthlySaleCount, setMonthlySaleCount] = useState(0);

  useEffect(() => {
    dispatch(fetchSales());
  }, [dispatch]);

  useEffect(() => {
    const last14DaysSales = getLast14DaysSales(sales);
    const aggregatedData = aggregateSalesByDate(last14DaysSales);
    // const formattedData = sales.map(sale => ({
    //   date: new Date(sale.createdAt).toLocaleDateString(),
    //   amount: sale.totalAmount
    // }));
    setSalesData(aggregatedData);
  }, [sales]);

  // Sales data for datagrid
  const rows =  [...sales].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 15).map((sale) => ({
    id: sale.saleId,
    col1: sale.saleId,
    col2: sale.buyerName,
    col3: sale.totalAmount,
    col4: sale.user.name,
    col5: new Date(sale.createdAt),
  }));

  const columns = [
    { field: "col1", headerName: "Sale Id", width: 100 },
    { field: "col2", headerName: "Customer", width: 160 },
    { field: "col3", headerName: "Total", width: 150 },
    { field: "col4", headerName: "Cashier", width: 100 },
    { field: "col5", headerName: "Created At", width: 200, type: "date", valueFormatter: (params) => {
      const date = params;
      return date ? date.toLocaleString() : "N/A"
      
      
    }},
    {
      field: "col6",
      headerName: "State",
      width: 100,
      renderCell: (params) => (
        <div className="flex items-center justify-center h-full">
          <div
            variant="contained"
            color="primary"
            className="bg-blue-800 flex rounded-full h-6 items-center px-3 text-[0.8rem]"
            // onClick={() => handleInvoice(params.row.id)}
          >
            Complete
          </div>
        </div>
      ),
    },
  ];

  const sortModel = [
    {
      field: 'col5', // Replace with your date field name
      sort: 'desc',       // Sort in descending order
    },
  ];

  const fetchTotalRevenue = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/sales/getTotalRevenue`);
      if(response.data.success) {
        setTotalRevenue(response.data.totalRevenue);
      } else {
        console.error("Failed to fetch total revenue");
      }
    } catch (error) {
      console.error("Error fetching total revenue:", error);
    }
  } 

  const fetchTotalSales = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/sales/getTotalSales`);
      if(response.data.success) {
        setTotalSalesCount(response.data.totalSalesCount);
      } else {
        console.error("Failed to fetch total sales");
      }
    } catch (error) {
      console.error("Error fetching total sales:", error);
    }
  }

  const fetchDailyRevenue = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/sales/getDailyRevenue`);
      if(response.data.success) {
        
        setDailyRevenue(response.data.dailyRevenue);
      } else {
        console.error("Failed to fetch Daily Revenue");
      }
    } catch (error) {
      console.error("Error fetching Daily Revenue:", error);
    }
  }

  const fetchMonthlySaleCount = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/sales/getMonthlySaleCount`);
      if(response.data.success) {
        setMonthlySaleCount(response.data.monthlySalesCount);
      } else {
        console.error("Failed to fetch Daily Revenue");
      }
    } catch (error) {
      console.error("Error fetching Daily Revenue:", error);
    }
  }






  // Get Total revenue
  useEffect(() => {
    fetchTotalRevenue();
    fetchTotalSales();
    fetchDailyRevenue();
    fetchMonthlySaleCount();
  },[])

  return (
    <MainLayout>
      <div className="w-full min-h-[800px] border-slate-700 rounded-md border py-6 px-6 ">
        <h1 className="text-2xl font-medium">Dashboard</h1>
        <span className="mt-4 h-[1px] bg-slate-700 w-full block"></span>
        {/* Dashboard content goes here */}
        <div className="mt-4 flex flex-wrap gap-4">
          <IconCard
            icon={<CircleDollarSign className="w-9 h-9 text-blue-400" />}
            amount={Number(totalRevenue).toFixed(2)}
            title="Total Revenue"
          />
          <IconCard
            icon={<CircleDollarSign className="w-9 h-9 text-blue-400" />}
            amount={Number(dailyRevenue).toFixed(2)}
            title="Daily Revenue"
          />
         
          <IconCard
            icon={<ChartNoAxesCombined className="w-9 h-9 text-blue-400" />}
            amount={totalSalesCount}
            title="Total Sales"
          />
          <IconCard
            icon={<ChartLine className="w-9 h-9 text-blue-400" />}
            amount={monthlySaleCount}
            title="Monthly Sales"
          />
        </div>
        {/* bottom row */}
        <div className="flex items-center gap-4 mt-8 flex-wrap">
          <div className="  w-[55%]  border-slate-700 rounded-md border py-6 px-6">
            <h3 className="text-lg font-medium text-slate-200">Recent Sales</h3>
            <div style={{ width: "100%", height: "450px" }} className="mt-8">
              <DataGrid
                rows={rows}
                columns={columns}
                className="text-white! rounded-lg border !border-gray-400 !text-gray-200"
                sortModel={sortModel}
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
          </div>
          <div className="flex-1  border-slate-700 rounded-md border py-4 px-6">
            <h3 className="text-lg font-medium text-slate-200">Performance</h3>
            <ResponsiveContainer width="100%" height={465} className="mt-8">
              <BarChart
                data={salesData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                {/* <CartesianGrid strokeDasharray="3 3"/> */}
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="amount" fill="#60a5fa" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
