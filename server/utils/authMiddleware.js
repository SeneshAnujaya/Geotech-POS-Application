import { errorHandler } from "./error.js";
import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) return next(errorHandler(401, "Unauthorized"));

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return next(errorHandler(403, "Forbidden"));
    req.user = user;
    next();
  });
};

export const isAdmin = (req, res, next) => {
  const token = req.cookies.access_token;

  console.log(token);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded.role);
    if (decoded.role !== "ADMIN") {
      return res
        .status(403)
        .json({ success: false, message: "Unauthorized request" });
    }

   

    next();
  } catch (error) {
    return next(errorHandler(403, "Invalid token"));
  }
};
