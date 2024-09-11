import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const recordSale = async (req, res) => {
    const {userId, items, buyerName } = req.body;

    if(!userId || !items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({success: false, message: "Invalid input data"})
    }

    try {
        const sale = await prisma.$transaction(async (prisma) => {
            const newSale = await prisma.sale.create({
                data: {
                    userId: parseInt(userId),
                    totalAmount: items.reduce((total, item) => total + item.price * item.cartQuantity, 0),
                    buyerName: buyerName
                }
            });

            for(const item of items) {
                console.log(item);
                
                const product = await prisma.product.findUnique({
                    where: { sku: item.sku },
                });

                if(!product) {
                    return res.status(400).json({success: false, message: `Product with Code ${item.sku} not found`});
                }

                if(product.quantity < item.cartQuantity) {
                    return res.status(400).json({success: false, message: `Not enough stock for product: ${product.name}`});
                }

                await prisma.salesItem.create({
                    data: {
                        saleId: newSale.saleId,
                        productId: item.productId,
                        quantity: item.cartQuantity,
                        price: item.price
                    }
                });
            }

            return newSale;
        })
        res.status(201).json({success: true, message: "Sale record add successfully", sale});
    } catch (error) {
        res.status(500).json({success: false, message: "can't create sale record"});
        console.error(error.message);
    }
}

export const getAllSales = async (req, res) => {
    try {
        const sales = await prisma.sale.findMany({
            include: {
                SalesItem: {
                    include: {
                        product: true
                    }
                },
                user: {
                    select: {
                        name: true,
                    }
                }
            }
        });
        res.status(200).json({ success: true, data: sales });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error fetching sales' });
    }
}

