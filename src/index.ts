import express, { Request, Response } from 'express';
import crypto from "crypto";


const app = express();
app.use(express.json());

/*
req.user = 'hello'; // 👈️ use request.something
return response.status(401) // 👈️ user response.someting
*/

app.post('/users', async (request: Request, response: Response) => {

    app.get('/', (request, response) => {
        response.send('response for GET request');
    })

    try {
        const { token } = request.headers;

        const { name, w3id } = request.body;

        if (!token) {
            return response.status(401).end();
        }

        if (!name || !w3id) {
            return response.status(500).json({ error: "Something went wrong..." });
        }

        const user = {
            id: crypto.randomBytes(16).toString("hex"),
            name: name,
            w3id: w3id,
        };

        return response.json(user);
    } catch (error) {
        response
            .status(500)
            .json({ message: "Something went wrong... 500" })

    }
});

app.listen(3000, () => console.log(`⚡️[server]: Server is running at http://localhost:${3000}`));