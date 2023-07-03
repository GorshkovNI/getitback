import express, { Request, Response } from 'express';
import {connectToDb} from "./server/db/db";
import router from "./server/routes/user.routes";
const pgp = require('pg-promise')();

const PORT = 3000

const app = express();


app.get('/', (req: Request, res: Response) => {
    res.send('OK')
})

app.use(express.json());
app.use(router);

connectToDb().then(() => {
    app.listen(PORT, () => {
        console.log(`Server started on http://localhost:${PORT}`);
    });
}).catch(error => console.log(error));
