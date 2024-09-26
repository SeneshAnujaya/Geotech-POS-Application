import { PrismaClient } from "@prisma/client";
import { upload } from "../utils/file_upload.js";

const prisma = new PrismaClient();

// Add Category
export const addCategory = async (req, res, next) => {
  // Handle file upload
  upload.single("categoryPic")(req, res, async (err) => {
    if (err) {
      return res
        .status(500)
        .json({ success: false, message: "File upload error" });
    }

    const { name } = req.body;

    if (!name) {
      return res
        .status(400)
        .json({ success: false, message: "Category Name is required" });
    }

    try {

      const existingCategory = await prisma.category.findUnique({
        where: { name },
      });

      if (existingCategory) {
        return res.status(400).json({
          success: false,
          message: "Category with this name already exists",
        });
      }
      
      const categoryPic = req.file ? req.file.filename : null;

      const newCategory = await prisma.category.create({
        data: {
          name,
          categoryPic,
        },
      });

      res.status(201).json({ success: true, data: newCategory });
    } catch (error) {
      console.error("Error adding category:", error);
      next(error); 
    }
  });
};

// Get All Categories
export const getAllCategories = async (req, res) => {
  try {
    const categories = await prisma.category.findMany();
    res.status(200).json({ success: true, data: categories });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error fetching categories" });
  }
};

// Delete Category
export const deleteCategory = async (req, res) => {
  const { id } = req.params;

  try {
    const relatedProducts = await prisma.product.findMany({
      where: {
        categoryId: Number(id),
      },
    });

    if (relatedProducts.length > 0) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Cannot delete category have products.",
        });
    }

    const category = await prisma.category.findUnique({
      where: { categoryId: Number(id) },
    });

    if (!category) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }

    await prisma.category.delete({
      where: { categoryId: Number(id) },
    });

    res
      .status(200)
      .json({ success: true, message: "Category deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error deleting category!" });
    console.error(error);
  }
};

// Edit Category
export const updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  try {
    const updatedCategory = await prisma.category.update({
      where: { categoryId: parseInt(id) },
      data: { name },
    });

    if (updateCategory) {
      res
        .status(200)
        .json({
          success: true,
          message: "Category updated successfully",
          data: updateCategory,
        });
    }
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error updating category" });
  }
};
