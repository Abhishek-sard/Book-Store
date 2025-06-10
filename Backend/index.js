import express, { request } from "express";
import mongoose from "mongoose"; // You need to import mongoose
import { PORT, MONGODB_URI } from "./config.js";
import { Book } from "./models/bookModel.js";

const app = express();

//middleware for parsing request body
app.use(express.json());

app.get("/", (request, response) => {
  console.log(request);
  return response.status(234).send("Welcome to the Book Store");
});

//route for save a new book

app.post("/books", async (request, response) => {
  try {
    if (
      !request.body.title ||
      !request.body.author ||
      !request.body.publishYear ||
      !request.body.price
    ) {
      return response.status(400).send({
        message: "Send all required fields: title, author, publishYear",
      });
    }
    const newBook = {
      title: request.body.title,
      author: request.body.author,
      publishYear: request.body.publishYear,
      price: request.body.price,
    };

    const book = await Book.create(newBook);

    return response.status(201).send(book);
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

//Route for Get all books from database
app.get("/books", async (request, response) => {
  try {
    const books = await Book.find({});

    return response.status(200).json({
        count:books.length,
        data: books,
    })

    response.status(200).json(books);
  } catch (error) {
    console.log(error.message);
    response.status(500).json({
      message: error.message,
    });
  }
});

// Connect to MongoDB and start server
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("App connected to database");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
