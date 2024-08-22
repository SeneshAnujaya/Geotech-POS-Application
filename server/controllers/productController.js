import { PrismaClient } from "@prisma/client";
import { errorHandler } from "../utils/error.js";

const prisma = new PrismaClient();

export const addProduct = async (req, res, next) => {
    const { sku, name, category, costPrice, retailPrice, quantity, brandName, warrantyPeriod } = req.body;

    if (!sku || !name || !category || !costPrice || !retailPrice || !quantity || !brandName || !warrantyPeriod) {
        return res.status(400).json({ success: false, message: "All fields are required" });
    }

    try {
        const newProduct = await prisma.product.create({
            data: {
                sku,
                name,
                costPrice,
                retailPrice,
                quantity,
                brandName,
                warrantyPeriod,
                category: {
                    connectOrCreate: {
                        where: { name: category },  // Connect to the category by its name
                        create: { name: category },  // Create a new category if it doesn't exist
                    },
                },
            },
        });

        res.status(201).json({ success: true, data: newProduct });
    } catch (error) {
        console.error('Error adding product:', error);
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

