import { PrismaClient } from "@prisma/client";
import { startOfDay, endOfDay, startOfMonth, endOfMonth } from "date-fns";

const prisma = new PrismaClient();

export const recordSale = async (req, res) => {
  const { userId, items, buyerName } = req.body;

  if (!userId || !items || !Array.isArray(items) || items.length === 0) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid input data" });
  }

  try {
    const sale = await prisma.$transaction(async (prisma) => {
      const newSale = await prisma.sale.create({
        data: {
          userId: userId,
          totalAmount: items.reduce(
            (total, item) => total + item.price * item.cartQuantity,
            0
          ),
          buyerName: buyerName,
        },
      });

      for (const item of items) {
        const product = await prisma.product.findUnique({
          where: { sku: item.sku },
        });

        if (!product) {
          return res.status(400).json({
            success: false,
            message: `Product with Code ${item.sku} not found`,
          });
        }

        if (product.quantity < item.cartQuantity) {
          return res.status(400).json({
            success: false,
            message: `Not enough stock for product: ${product.name}`,
          });
        }

        await prisma.salesItem.create({
          data: {
            saleId: newSale.saleId,
            productId: item.productId,
            quantity: item.cartQuantity,
            price: item.price,
          },
        });
      }

      return newSale;
    });
    res
      .status(201)
      .json({ success: true, message: "Sale record add successfully", sale });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "can't create sale record" });
    console.error(error.message);
  }
};

export const getAllSales = async (req, res) => {
  try {
    const sales = await prisma.sale.findMany({
      include: {
        SalesItem: {
          include: {
            product: true,
          },
        },
        user: {
          select: {
            name: true,
          },
        },
      },
    });
    res.status(200).json({ success: true, data: sales });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error fetching sales" });
  }
};

// Get Paginated Sales
export const getPaginationSales = async (req, res) => {
  try {
    const {page = 0, limit = 1 } = req.query;
    const pageNumber = parseInt(page);
    const pageSize = parseInt(limit);

    if (isNaN(pageNumber) || isNaN(pageSize) || pageNumber < 0 || pageSize <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid page or limit parameter",
      });
    }

    const skip = pageNumber * pageSize;

    const sales = await prisma.sale.findMany({
      include: {
        SalesItem: {
          include: {
            product: true,
          },
        },
        user: {
          select: {
            name: true,
          },
        },
      },
      skip,
      take: pageSize
    });

    const totalSales = await prisma.sale.count({
    });

    res.status(200).json({ success: true, data: sales, total: totalSales, page: pageNumber,limit: pageSize });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error fetching sales" });
  }
};

// Get Total Revenue
export const getTotalRevenue = async (req, res) => {
  try {
    const sales = await prisma.sale.findMany({
      select: {
        totalAmount: true,
        discount: true,
        paidAmount: true
      },
    });

    const totalRevenue = sales.reduce((sum, sale) => {
      // const discount = Number(sale.discount) || 0;
      // const amountAfterDiscount = parseFloat(sale.totalAmount.toString()) - discount;
      const paidAmount = parseFloat(sale.paidAmount);
    
    
      
      return sum + paidAmount;
    }, 0);

    res.status(200).json({
      success: true,
      totalRevenue: Number(totalRevenue).toFixed(2),
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Failed to calculate total revenue" });
  }
};

export const getSalesCount = async (req, res) => {
  try {
    const totalSalesCount = await prisma.sale.count();

    res.status(200).json({ success: true, totalSalesCount });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to get total sales count" });
  }
};

// Get Daily Revenue
export const getDailyRevenue = async (req, res) => {
  try {
    const today = new Date();
    const salesToday = await prisma.sale.findMany({
      where: {
        createdAt: {
          gte: startOfDay(today),
          lte: endOfDay(today),
        },
      },
    });

    const dailyRevenue = salesToday.reduce((total, sale) => {
      // const discount = Number(sale.discount) || 0;
      // const amountAfterDiscount = parseFloat(sale.totalAmount.toString()) - discount;
      const paidAmounts = parseFloat(sale.paidAmount);
      return total + paidAmounts;
    }, 0);

    res
      .status(200)
      .json({ success: true, dailyRevenue: Number(dailyRevenue).toFixed(2) });
  } catch (error) {
    console.error("Error getting daily revenue:", error);
    res.status(500).json({
      success: false,
      message: "Error getting daily revenue",
    });
  }
};

export const getMonthlySaleCount = async (req, res) => {
  try {
    const today = new Date();

    const monthStart = startOfMonth(today);
    const monthEnd = endOfMonth(today);

    const salesThisMonth = await prisma.sale.count({
      where: {
        createdAt: {
          gte: monthStart,
          lte: monthEnd,
        },
      },
    });

    res.status(200).json({
      success: true,
      monthlySalesCount: salesThisMonth,
    });
  } catch (error) {
    console.error("Error getting monthly sales count:", error);
    res.status(500).json({
      success: false,
      message: "Error getting monthly sales count",
    });
  }
};

// Generate Invoice Number
const generateInvoiceNumber = async (prisma) => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  // Get the count of sales for today to use as a sequential number
  const salesCount = await prisma.sale.count({
    where: {
      createdAt: {
        gte: new Date(year, date.getMonth(), day), // Start of the day
        lt: new Date(year, date.getMonth(), day + 1), // Start of the next day
      },
    },
  });

  // Format the invoice number
  const invoiceNumber = `INV-${year}-${month}-${day}-${String(
    salesCount + 1
  ).padStart(3, "0")}`;
  return invoiceNumber;
};

// Record sale and update stock when print invoice
export const createSaleRecordWithStockUpdate = async (req, res) => {
  const {
    userId,
    items,
    clientName,
    phoneNumber,
    discount,
    paidAmount,
    grandTotal,
    isBulkBuyer,
    selectedClientId,
    currentUserName,
  } = req.body;

  if (
    !userId ||
    !items ||
    !Array.isArray(items) ||
    items.length === 0 ||
    !clientName ||
    !phoneNumber
  ) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid input data" });
  }

  try {
    // Start transaction
    const sale = await prisma.$transaction(async (prisma) => {
      // generate Invoice Number
      const invoiceNumber = await generateInvoiceNumber(prisma);

      // step one - create sale record
      const newSale = await prisma.sale.create({
        data: {
          userId: userId,
          totalAmount: items.reduce(
            (total, item) => total + item.price * item.cartQuantity,
            0
          ),
          paidAmount : parseFloat(paidAmount),
          paymentStatus:
            Number(paidAmount) === 0
              ? "UNPAID"
              : Number(paidAmount) >= Number(grandTotal)
              ? "FULL PAID"
              : "PARTIALLY_PAID",
          buyerName: clientName,
          phoneNumber,
          bulkBuyerId: isBulkBuyer ? selectedClientId : null,
          discount: parseFloat(discount),
          invoiceNumber,
          cashierName: currentUserName,
        },
      });

      for (const item of items) {
        const product = await prisma.product.findUnique({
          where: { sku: item.sku },
        });

        if (!product) {
          throw new Error(`Product with SKU ${item.sku} not found`);
        }

        if (product.quantity < item.cartQuantity) {
          throw new Error(`Not enough stock for product: ${product.name}`);
        }

        // Create SalesItem
        await prisma.salesItem.create({
          data: {
            saleId: newSale.saleId,
            productId: item.productId,
            quantity: item.cartQuantity,
            price: item.price,
          },
        });

        // Update Stock
        await prisma.product.update({
          where: { sku: item.sku },
          data: { quantity: product.quantity - item.cartQuantity },
        });
      }

      if (isBulkBuyer) {
        const bulkBuyer = await prisma.bulkBuyer.update({
          where: { bulkBuyerId: selectedClientId },
          data: {
            outstandingBalance: {
              increment: grandTotal - paidAmount,
            },
          },
        });
      }
      return newSale;
    });

    res.status(201).json({
      success: true,
      message: "Sale record and stock updated successfully",
      sale,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error.message || "Sale record and stock updated Transaction failed",
    });
    console.error("Transaction failed: ", error.message);
  }
};
