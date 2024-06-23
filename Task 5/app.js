const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const app = express();
const PORT = 3000;

app.use(bodyParser.json());

app.post("/authors", (req, res) => {
  let singleAuthor = {
    id: Date.now(),
    name: req.body.name,
    biography: req.body.biography,
  };
  const allAuthors = fs.readFileSync("authors.json");
  const authors = JSON.parse(allAuthors);
  authors.push(singleAuthor);
  fs.writeFileSync("authors.json", JSON.stringify(authors));
  res.send(singleAuthor);
});

app.get("/authors", (req, res) => {
  try {
    const allAuthors = fs.readFileSync("authors.json");
    const authors = JSON.parse(allAuthors);
    res.send(authors);
  } catch (err) {
    if (err.code == "ENOENT") {
      res.status(500).send("Something went wrong!");
    }
  }
});

app.get("/authors/:id", (req, res) => {
  const allAuthors = fs.readFileSync("authors.json");
  const authors = JSON.parse(allAuthors);
  res.send(authors.find((elm) => elm.id == req.params.id));
});

app.put("/authors/:id", (req, res) => {
  const allAuthors = fs.readFileSync("authors.json");
  const authors = JSON.parse(allAuthors);
  const author = authors.find((elm) => elm.id == req.params.id);
  let newAuthor = {
    id: author.id,
    name: req.body.name == undefined ? author.name : req.body.name,
    biography:
      req.body.biography == undefined ? author.biography : req.body.biography,
  };
  let newAuthors = authors.filter((x) => x.id != req.params.id);
  newAuthors.push(newAuthor);
  fs.writeFileSync("authors.json", JSON.stringify(newAuthors));
  res.send(newAuthor);
});

app.delete("/authors/:id", (req, res) => {
  const allAuthors = fs.readFileSync("authors.json");
  const authors = JSON.parse(allAuthors);
  const author = authors.find((elm) => elm.id == req.params.id);
  let newAuthors = authors.filter((x) => x.id != req.params.id);
  fs.writeFileSync("authors.json", JSON.stringify(newAuthors));
  res.send(author);
});

app.post("/books", (req, res) => {
  let singleBook = {
    id: Date.now(),
    title: req.body.title,
    genre: req.body.genre,
    author: req.body.authorID,
  };
  const allBooks = fs.readFileSync("books.json");
  const books = JSON.parse(allBooks);
  books.push(singleBook);
  fs.writeFileSync("books.json", JSON.stringify(books));
  res.send(singleBook);
});

app.get("/books", (req, res) => {
  console.log("A");
  try {
    const allBooks = fs.readFileSync("books.json");
    const books = JSON.parse(allBooks);
    res.send(books);
  } catch (err) {
    if (err.code == "ENOENT") {
      res.status(500).send("Something went wrong!");
    }
  }
});

app.get("/books/:id", (req, res) => {
  const allBooks = fs.readFileSync("books.json");
  const books = JSON.parse(allBooks);
  res.send(books.find((elm) => elm.id == req.params.id));
});

app.put("/books/:id", (req, res) => {
  const allBooks = fs.readFileSync("books.json");
  const books = JSON.parse(allBooks);
  const book = books.find((elm) => elm.id == req.params.id);
  let newBook = {
    id: book.id,
    title: req.body.title == undefined ? book.title : req.body.title,
    genre: req.body.genre == undefined ? book.genre : req.body.genre,
    author: req.body.authorID == undefined ? book.authorID : req.body.authorID,
  };
  let newBooks = books.filter((x) => x.id != req.params.id);
  newBooks.push(newBook);
  fs.writeFileSync("books.json", JSON.stringify(newBooks));
  res.send(newBook);
});

app.delete("/books/:id", (req, res) => {
  const allBooks = fs.readFileSync("books.json");
  const books = JSON.parse(allBooks);
  const book = books.find((elm) => elm.id == req.params.id);
  let newBooks = books.filter((x) => x.id != req.params.id);
  fs.writeFileSync("books.json", JSON.stringify(newBooks));
  res.send(book);
});

app.get("/books/search/:keyword", (req, res) => {
  const allBooks = fs.readFileSync("books.json");
  const books = JSON.parse(allBooks);
  const query = req.params.keyword.toLowerCase();
  const results = books.filter(
    (book) =>
      book.title.toLowerCase().includes(query) ||
      book.author.toLowerCase().includes(query) ||
      book.genre.toLowerCase().includes(query)
  );
  res.send(results);
});

app.get("/authors/:id/books", (req, res) => {
  const allBooks = fs.readFileSync("books.json");
  const books = JSON.parse(allBooks);
  let newBooks = books.filter((elm) => elm.author == req.params.id)
  res.send(newBooks)
})

app.listen(PORT);
