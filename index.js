//importing express to create express server
import express from 'express';

//Importing cors for restricting domains/port
import cors from 'cors';

//Importing hallRouter to access other API endpoints
import hallRouter from './Routers/Hall_router.js';

//creating express server
const app = express();

//creating port
const PORT = 3333;

//using cors
app.use(cors());

//using json() method to parse the body data
app.use(express.json());

// Route handler for root endpoint
app.get('/', (req, res) => {
    const htmlResponse = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Hall Booking API</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f0f0f0;
                margin: 0;
                padding: 0;
            }
            .container {
                text-align: center;
                margin-top: 100px;
            }
            h1 {
                color: #333;
            }
            p {
                color: #666;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Hall Booking API Running</h1>
            <p>Kindly check the API in Postman.</p>
        </div>
    </body>
    </html>
    `;
    res.status(200).send(htmlResponse);
});

// Mounting hallRouter
app.use('/', hallRouter);

//Listening to the express server
app.listen(PORT, () => {
    console.log(`Express Server Connected with the Port : ${PORT}`);
});
