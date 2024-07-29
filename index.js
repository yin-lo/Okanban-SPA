// Par rapport à require avec dotenv : avec ESN on n'a qu'une ligne à écrire
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import multer from 'multer';

import express from 'express';
const app = express();

//? Cross-origin resource sharing (CORS)
app.use(
    cors({
        origin: '*', //* plusieurs origines ['http://localhost:5500', 'http://localhost:5173']
    })
);

app.use(cookieParser());

// Quand on utilise ESM, on doit préciser l'extension de fichier
import { router } from './src/routers/index.js';

//! On va laisser les 2, pour qu'il soit accepter
// * ce middleware sert à interpréter du formdata que l'on reçoit par req.body
app.use(multer().none());
// * ce middleware sert à interpréter du json que l'on reçoit par req.body
app.use(express.json());

app.use(express.static('./dist'));

app.use(router);

app.listen(process.env.PORT, () => {
    console.log(
        `Example app listening on port ${process.env.BASE_URL}:${process.env.PORT}`
    );
});
