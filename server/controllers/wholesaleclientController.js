import { PrismaClient } from "@prisma/client";
import { errorHandler } from "../utils/error.js";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

const prisma = new PrismaClient();

export const addBulkBuyer = async (req, res) => {
    const {clientName, phonenumber, email, companyName} = req.body;
   

    if (!clientName || !phonenumber) {
        return res
          .status(400)
          .json({ success: false, message: "Client name and Phone number are required" });
      }

    try {

        const existingClient = await prisma.bulkBuyer.findFirst({
            where: {
                OR: [
                    { name: clientName },
                    { phoneNumber: phonenumber },
                ],
            },
        });

        if (existingClient) {
            return res.status(409).json({
                success: false,
                message: "A client with the same name or phone number already exists",
            });
        }

        const newBulkBuyer = await prisma.bulkBuyer.create({
            data: {
                name: clientName,
                phoneNumber : phonenumber,
                email,
                companyName,
                outstandingBalance: 0.00,
            },
        });

        return res.status(201).json({
            success: true,
            message: "Client added successfully",
            data: newBulkBuyer
        })
    } catch (error) {
        console.error('Error adding bulk buyer:', error);
        return res.status(500).json({
            success: false,
            message: 'Error adding bulk buyer',
            error: error.message,
        });
    }
}

// Get Wholesale Clients Infomation

export const getBulkBuyers = async (req, res, next) => {
    try {
      const bulkBuyersData = await prisma.bulkBuyer.findMany();
  
      res.status(200).json({ success: true, data: bulkBuyersData });
    } catch (error) {
      res.status(500).json({ success: false, message: "Error fetching bulkBuyers info" });
    }
  };