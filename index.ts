import express, { NextFunction, Request, Response } from 'express';
import { connectToDb } from "./server/db/db";
import userRouter from "./server/routes/user.routes";
const pgp = require('pg-promise')();
import cors from 'cors'
import errorHandler, { ApiError } from "./server/middlewares/error-midlewares";
require('dotenv').config();

const PORT = 3000

const app = express();


app.get('/', (req: Request, res: Response) => {
    res.send('OK')
})

app.use(express.json());

app.use(cors({
    origin: 'http://localhost:8080',
    credentials: true,
    exposedHeaders: ['set-cookie', 'Content-Length', 'X-Foo', 'X-Bar']
}))

app.use(userRouter);

// Middleware для обработки ошибок
app.use(
    (err: Error | ApiError, req: Request, res: Response, next: NextFunction) => {
        // Обработка ошибок, созданных с помощью ApiError
        if (err instanceof ApiError) {
            return res.status(err.status).json({ message: err.message, errors: err.errors });
        }

        // Обработка остальных ошибок
        errorHandler(err, req, res, next);
    }
);

connectToDb().then(() => {
    app.listen(PORT, () => {
        console.log(`Server started on http://localhost:${PORT}`);
    });
}).catch(error => console.log(error));
