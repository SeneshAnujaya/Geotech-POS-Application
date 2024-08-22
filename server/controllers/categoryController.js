import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const addCategory = async (req, res, next) => {
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ success: false, message: "Category Name is required" });
    }

    try {
        const newCategory = await prisma.category.create({
            data: {
                name,
                
            },
        });

        res.status(201).json({ success: true, data: newCategory });
    } catch (error) {
        console.error('Error adding product:', error);
        next(error);
    }
};

export const getAllCategories = async (req, res) => {
    try {
        const categories = await prisma.category.findMany();
        res.status(200).json({ success: true, data: categories });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching categories' });
    }
}
