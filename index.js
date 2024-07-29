// Par rapport à require avec dotenv : avec ESN on n'a qu'une ligne à écrire
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import cors from 'cors';
// ! import du package anti csrf
import { doubleCsrf } from 'csrf-csrf';
import multer from 'multer';

import express from 'express';
const app = express();

//! TODO :
//? Cross-origin resource sharing (CORS)
//* https://developer.mozilla.org/fr/docs/Web/HTTP/CORS
app.use(
    cors({
        //* "*" signifie que tous les sites ont accès à l'API
        origin: '*', //* plusieurs origines ['http://localhost:5500', 'http://localhost:5173']
        // methods: '*', // ['GET', 'PUT', 'POST', 'PATCH'] la methode `delete` ne sera pas acceptée coté client
        credentials: true, //! indispensable pour le fonctionnement du csrf
        // Configure the Access-Control-Allow-Credentials CORS header.
        // Set to true to pass the header, otherwise it is omitted.
        // permet de déterminer si le serveur autorise les requêtes cross-origin à inclure des informations d'identification,
        // telles que des cookies ou des jetons d'authentification
    })
);

//! Cross-Site Request Forgery (CSRF) est une attaque qui usurpe l'identité d'un utilisateur de confiance et envoie des commandes non désirées sur un site web
//! CSRF: https://kourou.oclock.io/ressources/fiche-recap/cross-site-request-forgery-csrf/
//! pour le csrf: https://www.npmjs.com/package/csrf-csrf
const {
    invalidCsrfTokenError, // * This is just for convenience if you plan on making your own middleware.
    generateToken, // * Use this in your routes to provide a CSRF hash + token cookie and token.
    validateRequest, // * Also a convenience if you plan on making your own middleware.
    doubleCsrfProtection, // * This is the default CSRF protection middleware.
} = doubleCsrf({
    getSecret: () => process.env.TOKEN_SECRET, // A function that optionally takes the request and returns a secret
    cookieName: '__Host-psifi.x-csrf-token', // The name of the cookie to be used, recommend using Host prefix.
    cookieOptions: {
        sameSite: 'lax', // Recommend you make this strict if possible
        path: '/',
        secure: false, //! false car on n'a pas https
        httpOnly: true, // par défaut, ce package transmet des cookies par le protocole http : on ne pourra pas modifier ce cookie depuis le navigateur
    },
    size: 64, // The size of the generated tokens in bits
    ignoredMethods: ['GET', 'HEAD', 'OPTIONS'], //! A list of request methods that will not be protected.
    getTokenFromRequest: req => req.headers['x-csrf-token'], // A function that returns the token from the request
});
//! On branche cookieParser dont se sert csrf-csrf pour vérifier la validité du token
app.use(cookieParser());

// Quand on utilise ESM, on doit préciser l'extension de fichier
import { router } from './src/routers/index.js';

//! On va laisser les 2, pour qu'il soit accepté
// * ce middleware sert à interpréter du formdata que l'on reçoit par req.body
app.use(multer().none());
// * ce middleware sert à interpréter du json que l'on reçoit par req.body
app.use(express.json());

//! ce middleware sert à ajouter un csrf token sur la réponse
//! au lancement du front, la fonction getToken devra etre executée pour recup du token coté front (dans le index.js)
//! front: une fois le token récupéré, on le mettra comme content de la meta 'meta[name="csrf-token"]'
app.get('/token', (req, res) => {
    try {
        if (!req.headers['x-csrf-token']) {
            // ! on passe req et res à generateToken pour qu'il puisse gérer le cookie et les headers
            const token = generateToken(req, res);

            return res.json(token);
        }
    } catch (error) {
        console.log(error);
        console.log(error.message);
    }
});

//! pour chaque route, je check que le x-csrf token est bien là, undefined si route GET
// app.use((req, res, next) => {
//     console.log(req.headers['x-csrf-token']);
//     next();
// });

//! On commente le middleware pour cet 1re journée de fetch, on fera la config du front avec ensemble lundi
//! après cette ligne, les routes POST seront protégées
// app.use(doubleCsrfProtection);
//!----------------------------------------------------
app.use(router);

app.listen(process.env.PORT, () => {
    console.log(
        `Example app listening on port ${process.env.BASE_URL}:${process.env.PORT}`
    );
});
