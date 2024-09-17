import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import { MenuRoute } from './routes/menu';
import { MenuController } from './controllers/menu';
import { errorHandler } from './controllers/middleware/error-handler';

mongoose.connect(process.env.MONGO_URL as string, {
    dbName: process.env.MONGO_DB
});
const PORT = process.env.PORT;
const menuController = new MenuController();
const menuRoute = new MenuRoute(menuController);

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
    cors({
        origin: 'http://localhost:3001'
    })
);

app.use('/api/menu', menuRoute.getRouter());

app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`server running on port: ${PORT}`);
});
