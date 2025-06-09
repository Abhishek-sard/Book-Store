import express from "express";
import mongoose from "mongoose";  // You need to import mongoose
import { PORT, MONGODB_URI } from "./config.js";

const app = express();

app.get('/', (request, response) => {
    console.log(request);
    return response.status(234).send("Welcome to the Book Store");
});

// Connect to MongoDB and start server
mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log('App connected to database');
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        })
    })
    .catch((error) => {
        console.log(error);
    });