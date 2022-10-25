import express from 'express';
import * as Sentry from "@sentry/node";
import * as Tracing from "@sentry/tracing";
import crypto from "crypto";


const app = express();
app.use(express.json());

Sentry.init({
    dsn: "https://76e689d9bfa34c509d8c7c9c441043ee@o4504045726269440.ingest.sentry.io/4504045730267136",
    integrations: [

        new Sentry.Integrations.Http({ tracing: true }),

        new Tracing.Integrations.Express({ app }),
    ],

    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,
});

// RequestHandler creates a separate execution context using domains, so that every
// transaction/span/breadcrumb is attached to its own Hub instance
app.use(Sentry.Handlers.requestHandler());
// TracingHandler creates a trace for every incoming request
app.use(Sentry.Handlers.tracingHandler());

/*
req.user = 'hello'; // 👈️ use request.something
return response.status(401) // 👈️ user response.someting
*/


// All controllers should live here
app.get("/", function rootHandler(req, res) {
    res.end("Hello world!");
});

app.post("/users", function rootHandler(req, res) {


    const { name, w3id } = req.body;

    if (!name || !w3id) {
        return res.status(500).json({ error: "Something went wrong..." });
    }

    const user = {
        id: crypto.randomBytes(16).toString("hex"),
        name: name,
        w3id: w3id,
    };
    return res.json(user);
});

app.get("/debug-sentry", function mainHandler(req, res) {
    throw new Error("My first Sentry error!");
});

// The error handler must be before any other error middleware and after all controllers
app.use(Sentry.Handlers.errorHandler());



/*
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

*/
app.listen(3000, () => console.log(`⚡️[server]: Server is running at http://localhost:${3000}`));