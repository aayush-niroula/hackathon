import express, { urlencoded } from 'express';
import { connectToDb, disconnectFromDb } from './db/index.js'; // Ensure you export a disconnect function from your db module
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import userRoutes from './routes/user.routes.js';
import bodyParser from 'body-parser';
import cors from 'cors';

const PORT = 8000;
dotenv.config({});

const app = express();

// Middleware setup
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: "https://aimscodequests.vercel.app"
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(urlencoded({ extended: true }));

// Start the server and connect to the database
let server;
const startServer = async () => {
    try {
        connectToDb();
        console.log("Database connected successfully");
        server = app.listen(PORT, () => {
            console.log(`Server listening at port ${PORT}`);
        });
    } catch (error) {
        console.error("Failed to start the server:", error);
        process.exit(1); // Exit the process if the server fails to start
    }
};

// Graceful shutdown logic
const gracefulShutdown = async () => {
    console.log("\nInitiating graceful shutdown...");
    try {
        if (server) {
            server.close(() => {
                console.log("Server closed");
            });
        }
        await disconnectFromDb();
        console.log("Database connection closed");
        process.exit(0); // Exit gracefully
    } catch (error) {
        console.error("Error during shutdown:", error);
        process.exit(1); // Exit with an error code
    }
};

// Handle termination signals
process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);

// API routes
app.use('/api/v1/user', userRoutes);

// Start the server
startServer();
