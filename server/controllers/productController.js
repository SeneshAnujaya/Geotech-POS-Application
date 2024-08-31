import { PrismaClient } from "@prisma/client";
import { errorHandler } from "../utils/error.js";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

const prisma = new PrismaClient();

export const addProduct = async (req, res, next) => {
  const {
    sku,
    productName,
    categoryId,
    brand,
    costPrice,
    retailPrice,
    quantity,
    warranty,
  } = req.body;

  if (
    !sku ||
    !productName ||
    !categoryId ||
    !costPrice ||
    !retailPrice ||
    !quantity ||
    !brand ||
    !warranty
  ) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
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
        categoryId: parseInt(categoryId),
      },
    });

    res.status(201).json({ success: true, data: newProduct });
  } catch (error) {
    console.error("Error adding product:", error);
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
    const products = await prisma.product.findMany({
      include: {
        category: true, // This will include the category data in the product
      },
    });
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error fetching products" });
  }
};

// UPDATE PRODUCT STOCK COUNT
export const updateProductsStock = async (req, res) => {
  const { stockUpdates } = req.body;

  // Handle the case where stockUpdates is empty
  if (!stockUpdates || stockUpdates.length === 0) {
    return res
      .status(400)
      .json({ success: false, message: "No stock updates provided" });
  }

  try {
    prisma.$transaction(async (prisma) => {
      for (const update of stockUpdates) {
        await prisma.product.update({
          where: { sku: update.sku },
          data: { quantity: update.newQuantity },
        });
      }
    });
    res
      .status(200)
      .json({ success: true, message: "Stock updated successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update stock" });
    console.error("Error updating stock:", error);
  }
};
