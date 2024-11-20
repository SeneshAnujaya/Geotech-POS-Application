import { PrismaClient } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { errorHandler } from "../utils/error.js";

const prisma = new PrismaClient();

export const createPayment = async (req, res) => {

  const saleId = req.body.saleId;
  const payAmount = Number(req.body.payAmount);
  const bulkBuyerId = req.body.bulkBuyerId ? req.body.bulkBuyerId : null;

  console.log(bulkBuyerId);
  

  try {
    const payment = await prisma.payment.create({
      data: {
        saleId: saleId,
        paymentAmount: payAmount,
        bulkBuyerId: bulkBuyerId,
      }
    });
    
    const sale = await prisma.sale.findUnique({
      where: {saleId : saleId } });

      const updatedPaidAmount = Number(sale.paidAmount) + payAmount;
      const updatedTotalBalance = Number(sale.totalAmount) - Number(sale.discount);
      const updatedDueBalance = updatedTotalBalance - updatedPaidAmount;

      const paymentStatus = updatedDueBalance <= 0 ? "FULL PAID" : updatedPaidAmount > 0 ? "PARTIALLY_PAID" : "UNPAID";

      const updatedSale = await prisma.sale.update({
        where: {saleId: saleId},
        data: {
          paidAmount: updatedPaidAmount,
          paymentStatus: paymentStatus
        }
      });

      if(bulkBuyerId) {
        const updatedBulkBuyer = await prisma.bulkBuyer.update({
          where: {bulkBuyerId: bulkBuyerId},
          data: {
            outstandingBalance: {decrement: payAmount }
          }
        })
      }

    res.status(201).json({ success: true, message: "Payment added & sale record update successfully! ", payment});
  } catch (error) {
    console.error("Error processing payment:", error);
    res.status(500).json({success: false, message: "payment & sale record update failed!"})
  }
}



