import { PrismaClient } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import {errorHandler} from "../utils/error.js";


const prisma = new PrismaClient();

export const getusers = async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      where: {
        role: "EMPLOYEE"
      },
      select: {
        id:true,
        email:true,
        name:true,
        role:true,
        createdAt:true,
        updatedAt:true
      }
    });
    
    res.status(200).json({ success: true, data: users });
    
  } catch (error) {
    res
    .status(500)
    .json({ success: false, message: "Error fetching users" });
  }
}

export const deleteuser = async (req, res) => {

  const {id} = req.params;

  try {
    const user = await prisma.user.findUnique({
      where: {id: Number(id)}
    });
  
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
  
    await prisma.user.delete({
      where: {id: Number(id)},
  });
  
  res
  .status(200)
  .json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    res
    .status(500)
    .json({ success: false, message: "Error deleting user!" });
  
  }

}
