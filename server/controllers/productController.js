import { PrismaClient } from "@prisma/client";
import { errorHandler } from "../utils/error.js";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

const prisma = new PrismaClient();

export const addProduct = async (req, res, next) => {
   
    
    const { sku, productName, categoryId, brand, costPrice, retailPrice, quantity, warranty } = req.body;

    if (!sku || !productName || !categoryId || !costPrice || !retailPrice || !quantity || !brand || !warranty) {
        return res.status(400).json({ success: false, message: "All fields are required" });
    }

    try {
        const newProduct = await prisma.product.create({
            data: {
                sku,
                name: productName,
                costPrice,
                retailPrice,
                quantity: parseInt(quantity),
                brandName: brand,
                warrantyPeriod: warranty,
                categoryId: parseInt(categoryId)
            },
        });

        res.status(201).json({ success: true, data: newProduct });
    } catch (error) {
        console.error('Error adding product:', error);
        if (error instanceof PrismaClientKnownRequestError) {
            if (error.code === "P2002") {
              return res
                .status(400)
                .json({ success: false, message: "SKU Number already exists" });
            }
          }
        next(error);
     
    }
};

// GET ALL PRODUCTS
export const getAllProducts = async (req, res) => {
    try {
        const products = await prisma.product.findMany( {include: {
            category: true,  // This will include the category data in the product
        },});
        res.status(200).json({ success: true, data: products });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching products' });
    }
}

