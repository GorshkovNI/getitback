import express, { Request, Response } from 'express';
import {connectToDb} from "./db/db";
const pgp = require('pg-promise')();

const PORT = 3000

const app = express();

app.get('/', (req: Request, res: Response) => {
    res.send('First server ts')
})

connectToDb().then(() => {
    app.listen(PORT, () => {
        console.log(`Server started on http://localhost:${PORT}`);
    });
}).catch(error => console.log(error));
