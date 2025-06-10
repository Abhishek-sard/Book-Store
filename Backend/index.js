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


app.get("/books/:id", async (request, response) => {
  try {
    const { id } = request.params;
    
    // Validate the ID format first
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return response.status(400).json({ 
        message: "Invalid book ID format" 
      });
    }

    // Find the book by ID (corrected from findById({}))
    const book = await Book.findById(id);

    // Check if book exists
    if (!book) {
      return response.status(404).json({ 
        message: "Book not found" 
      });
    }

    // Return the found book
    return response.status(200).json(book);

  } catch (error) {
    console.error("Error in GET /books/:id:", error.message);
    response.status(500).json({
      message: "Server error while fetching book",
      error: error.message
    });
  }
});


//route for update a book
app.put('/books/:id', async (request, response) => {
    try {
        // Validate request body
        if (!request.body.title || !request.body.author || !request.body.publishYear || !request.body.price) {
            return response.status(400).json({
                message: "Send all required fields: title, author, publishYear, price",
            });
        }

        // Validate ID format
        const { id } = request.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return response.status(400).json({
                message: "Invalid book ID format"
            });
        }

        // Update the book
        const result = await Book.findByIdAndUpdate(
            id,
            request.body,
            { new: true } // Return the updated document
        );

        if (!result) {
            return response.status(404).json({
                message: "Book not found"
            });
        }

        // Return the updated book
        return response.status(200).json({
            message: "Book updated successfully",
            data: result
        });

    } catch (error) {
        console.error("Error in PUT /books/:id:", error.message);
        return response.status(500).json({
            message: "Server error while updating book",
            error: error.message
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
