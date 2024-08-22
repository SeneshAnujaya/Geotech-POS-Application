import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';


// IMPORT ROUTES
import authRouter from './routes/authRoute.js';
import productsRouter from './routes/productsRoute.js';
import categoryRouter from './routes/categoryRoute.js';

const app = express();

app.use(express.json());
app.use(cookieParser());

const corsOptions = {
    origin: 'http://localhost:5173', // Frontend URL
    credentials: true, // Enable set cookie
  };

  app.use(cors(corsOptions));

// ROUTES
app.use("/api/auth", authRouter);
app.use("/api/products", productsRouter);
app.use("/api/category", categoryRouter);

app.listen(3000, () => {
    console.log('Server is running on port 3000!');
    
});

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    return res.status(statusCode).json({
        success: false,
        statusCode,
        message
    });
});