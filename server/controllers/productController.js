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
    wholesalePrice,
  } = req.body;

  if (
    !sku ||
    !productName ||
    !categoryId ||
    !costPrice ||
    !retailPrice ||
    !quantity ||
    !brand ||
    !warranty ||
    !wholesalePrice
  ) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  }

  try {
    const existingProduct = await prisma.product.findUnique({
      where: { sku: sku },
    });

    if (existingProduct) {
      return res
        .status(400)
        .json({ success: false, message: "SKU already exists" });
    }

    const newProduct = await prisma.product.create({
      data: {
        sku,
        name: productName,
        costPrice: parseFloat(costPrice),
        retailPrice: parseFloat(retailPrice),
        wholesalePrice: parseFloat(wholesalePrice),
        quantity: parseInt(quantity),
        brandName: brand,
        warrantyPeriod: warranty,
        categoryId: categoryId,
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
      where: { isDeleted: false },
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

// GET PAGINATION PRODUCTS
export const getPaginationProducts = async (req, res) => {
  try {
    const { page = 0, limit = 20, searchTerm } = req.query;
    const pageNumber = parseInt(page);
    const pageSize = parseInt(limit);

    // const skip = (pageNumber - 1) * pageSize;
    // Validate inputs
    if (
      isNaN(pageNumber) ||
      isNaN(pageSize) ||
      pageNumber < 0 ||
      pageSize <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid page or limit parameter",
      });
    }

    // const skip = Math.max(0, (pageNumber - 1) * pageSize);
    const skip = pageNumber * pageSize;

    // Check searchterm matched for category
    let categoryFilter = {};
    if (searchTerm) {
      const categoryMatch = await prisma.category.findFirst({
        where: {
          name: { contains: searchTerm, mode: "insensitive" },
        },
        select: { categoryId: true },
      });

      if (categoryMatch) {
        categoryFilter = {
          categoryId: categoryMatch.categoryId,
        };
      }
    }

    const searchFilter = searchTerm
      ? {
          OR: [
            { name: { contains: searchTerm, mode: "insensitive" } },
            { sku: { contains: searchTerm, mode: "insensitive" } },
            { brandName: { contains: searchTerm, mode: "insensitive" } },
            categoryFilter,
            // {category: { contains: searchTerm, mode: "insensitive" } },
          ],
        }
      : {};

    const products = await prisma.product.findMany({
      where: { isDeleted: false, ...searchFilter },
      include: {
        category: true,
      },
      skip,
      take: pageSize,
    });

    const totalProducts = await prisma.product.count({
      where: { isDeleted: false, ...searchFilter },
    });

    res.status(200).json({
      success: true,
      data: products,
      total: totalProducts,
      page: pageNumber,
      limit: pageSize,
    });
  } catch (error) {
    console.log(error);

    res
      .status(500)
      .json({ success: false, message: "Error fetching products" });
  }
};

// PAGINATED FILTER PRODUCTS QUERY
export const getPaginatedFilteredProducts = async (req, res) => {
  const { category, search, page = 0, limit = 20 } = req.query;

  try {
    const pageNumber = parseInt(page, 10);
    const pageLimit = parseInt(limit, 10);

    const skip = pageNumber * pageLimit;

    const where = {
      isDeleted: false,
    };

    if (category) {
      where.category = {
        name: { equals: category, mode: "insensitive" },
      };
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { sku: { contains: search, mode: "insensitive" } },
      ];
    }

    const products = await prisma.product.findMany({
      where,
      skip,
      take: pageLimit,
      include: {
        category: true,
      },
    });

    const totalCount = await prisma.product.count({
      where: { isDeleted: false },
    });

    res.status(200).json({
      success: true,
      products,
      total: totalCount,
      page: pageNumber,
      limit: pageLimit,
    });
  } catch (error) {
    console.log(error);

    res
      .status(500)
      .json({
        success: false,
        message: "Error fetching paginated filtered products",
      });
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

// Update Product
export const updateProduct = async (req, res) => {
  const { sku } = req.params;

  const {
    col1: productSku,
    col2: name,
    description,
    col3: costPrice,
    col4: retailPrice,
    col5: wholesalePrice,
    col6: quantity,
    col7: brandName,
    col9: warrantyPeriod,
  } = req.body;

  if (!sku) {
    return res.status(400).json({ success: false, message: "SKU is required" });
  }

  if (
    !productSku &&
    !name &&
    !description &&
    !costPrice &&
    !retailPrice &&
    !quantity &&
    !brandName &&
    !warrantyPeriod
  ) {
    return res.status(400).json({
      success: false,
      message: "At least one field must be provided for update",
    });
  }

  try {
    const product = await prisma.product.findUnique({
      where: { sku: sku },
    });

    if (!product) {
      return res
        .status(400)
        .json({ success: false, message: "Product not found" });
    }

    if(productSku && productSku !== sku) {
      const existingProductWithSku = await prisma.product.findUnique({where: {sku: productSku}})
      if(existingProductWithSku) {
        return res.status(400).json({
          success: false, message:`Product with SKU is already exists.`
        })
      }
    }

    const updatedProduct = await prisma.product.update({
      where: { sku: sku },
      data: {
        sku:productSku !== undefined ? productSku : product.sku,
        name: name || product.name,
        costPrice:
          costPrice !== undefined ? parseFloat(costPrice) : product.costPrice,
        retailPrice:
          retailPrice !== undefined
            ? parseFloat(retailPrice)
            : product.retailPrice,
        wholesalePrice:
          wholesalePrice !== undefined
            ? parseFloat(wholesalePrice)
            : product.wholesalePrice,
        quantity:
          quantity !== undefined ? parseFloat(quantity) : product.quantity,
        brandName: brandName || product.brandName,
        warrantyPeriod: warrantyPeriod || product.warrantyPeriod,
      },
    });

    res.status(200).json({
      success: true,
      message: "Product updated successfully!",
      data: updatedProduct,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error updating product" });
  }
};

// SOFT Delete Product
export const deleteProduct = async (req, res) => {
  const { sku } = req.params;

  try {
    const product = await prisma.product.findUnique({
      where: { sku: sku },
    });

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    // Soft delete: Set isDeleted to true
    await prisma.product.update({
      where: { sku: sku },
      data: { isDeleted: true },
    });

    res
      .status(200)
      .json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error deleting product!" });
    console.error(error);
  }
};
