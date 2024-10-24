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
          userId: parseInt(userId),
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
          return res
            .status(400)
            .json({
              success: false,
              message: `Product with Code ${item.sku} not found`,
            });
        }

        if (product.quantity < item.cartQuantity) {
          return res
            .status(400)
            .json({
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

export const getTotalRevenue = async (req, res) => {
  try {
    const totalRevenue = await prisma.sale.aggregate({
      _sum: {
        totalAmount: true,
      },
    });

    res
      .status(200)
      .json({
        success: true,
        totalRevenue: totalRevenue._sum.totalAmount || 0,
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

    const dailyRevenue = salesToday.reduce(
      (total, sale) => total + sale.totalAmount,
      0
    );

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


// Record sale and update stock when print invoice
export const createSaleRecordWithStockUpdate = async (req, res) => {
    const { userId, items, buyerName, phoneNumber } = req.body;

    if (!userId || !items || !Array.isArray(items) || items.length === 0 || !buyerName || !phoneNumber) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid input data" });
      }

    try {
        // Start transaction
        const sale = await prisma.$transaction(async (prisma) => {
            // step one - create sale record
            const newSale = await prisma.sale.create({
                data: {
                  userId: parseInt(userId),
                  totalAmount: items.reduce(
                    (total, item) => total + item.price * item.cartQuantity,
                    0
                  ),
                  buyerName: buyerName,
                  phoneNumber
                },
              });

              for(const item of items) {
                const product = await prisma.product.findUnique({
                    where: {sku: item.sku}
                });

                if(!product) {
                    throw new Error(`Product with SKU ${item.sku} not found`);
                }

                if(product.quantity < item.cartQuantity) {
                    throw new Error(`Not enough stock for product: ${product.name}`); 
                }

                // Create SalesItem
                await prisma.salesItem.create({
                    data: {
                        saleId: newSale.saleId,
                        productId: item.productId,
                        quantity: item.cartQuantity,
                        price: item.price
                    },
                });

                // Update Stock
                await prisma.product.update({
                    where: {sku: item.sku},
                    data: {quantity: product.quantity - item.cartQuantity }
                });
            }
            return newSale;
        });

        res.status(201).json({success: true, message: "Sale record and stock updated successfully", sale})
     
        
    } catch (error) {
        res.status(500).json({success: false, message: error.message || "Sale record and stock updated Transaction failed"});
        console.error("Transaction failed: ", error.message);
    }
}
