const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const app = express();
const PORT = 3000;

app.use(bodyParser.json());

app.post("/products", (req, res) => {
  let singleProduct = {
    id: Date.now(),
    name: req.body.name,
    description: req.body.description,
    price: req.body.price
  };
  const allProducts = fs.readFileSync("products.json");
  const products = JSON.parse(allProducts);
  products.push(singleProduct);
  fs.writeFileSync("products.json", JSON.stringify(products));
  res.send(singleProduct);
});

app.get("/products", (req, res) => {
  try {
    const allProducts = fs.readFileSync("products.json");
    const result = JSON.parse(allProducts);
    res.send(result);
  } catch (err) {
    if (err.code == "ENOENT") {
      res.status(500).send("Something went wrong!");
    }
  }
});

app.get("/products/:id", (req, res) => {
  const allProducts = fs.readFileSync("products.json");
  const products = JSON.parse(allProducts);
  res.send(products.find((elm) => elm.id == req.params.id));
});

app.put("/products/:id", (req, res) => {
  const allProducts= fs.readFileSync("products.json");
  const products = JSON.parse(allProducts);
  const product = products.find((elm) => elm.id == req.params.id);
  let newProduct = {
    id: product.id,
    name: req.body.name == undefined ? product.name : req.body.name,
    description: req.body.description == undefined ? product.description : req.body.description,
    price: req.body.price == undefined ? product.price : req.body.price,
  };
  let newProducts = products.filter((x) => x.id != req.params.id);
  newProducts.push(newProduct);
  fs.writeFileSync("products.json", JSON.stringify(newProducts));
  res.send(newProduct);
});

app.delete("/products/:id", (req, res) => {
  const allProducts = fs.readFileSync("products.json");
  const products = JSON.parse(allProducts);
  const product = products.find((elm) => elm.id == req.params.id);
  let newProducts = products.filter((x) => x.id != req.params.id);
  fs.writeFileSync("products.json", JSON.stringify(newProducts));
  res.send(product);
});

app.post("/orders", (req, res) => {
  let singleOrder = {
    id: Date.now(),
    name: req.body.name,
    description: req.body.description,
    status: "Pending",
    items: {},
    userID: req.body.userID
  };
  const allOrders = fs.readFileSync("orders.json");
  const orders = JSON.parse(allOrders);
  orders.push(singleOrder);
  fs.writeFileSync("orders.json", JSON.stringify(orders));
  res.send(singleOrder);
});

app.get("/orders", (req, res) => {
  try {
    const allOrders = fs.readFileSync("orders.json");
    const result = JSON.parse(allOrders);
    res.send(result);
  } catch (err) {
    if (err.code == "ENOENT") {
      res.status(500).send("Something went wrong!");
    }
  }
});

app.get("/orders/:id", (req, res) => {
  const allOrders = fs.readFileSync("orders.json");
  const orders = JSON.parse(allOrders);
  res.send(orders.find((elm) => elm.id == req.params.id));
});

app.put("/orders/:id", (req, res) => {
  const allOrders = fs.readFileSync("orders.json");
  const orders = JSON.parse(allOrders);
  const order = orders.find((elm) => elm.id == req.params.id);
  let newOrder = {
    id: order.id,
    name: req.body.name == undefined ? order.name : req.body.name,
    description: req.body.description == undefined ? order.description : req.body.description,
    status: order.status,
    items: {},
    userID: order.userID
  };
  let newOrders = orders.filter((x) => x.id != req.params.id);
  newOrders.push(newOrder);
  fs.writeFileSync("orders.json", JSON.stringify(newOrders));
  res.send(newOrder);
});

app.delete("/orders/:id", (req, res) => {
  const allOrders = fs.readFileSync("orders.json");
  const orders = JSON.parse(allOrders);
  const order = orders.find((elm) => elm.id == req.params.id);
  const newOrders = orders.filter((x) => x.id != req.params.id);
  fs.writeFileSync("orders.json", JSON.stringify(newOrders));
  res.send(order);
});

app.post("/orders/:id/items", (req, res) => {
  const allOrders = fs.readFileSync("orders.json");
  const orders = JSON.parse(allOrders);
  const order = orders.find((elm) => elm.id == req.params.id);
  let orderWithItems = {
    id: order.id,
    name: order.name,
    description: order.description,
    status: order.status,
    items: {
      item1: req.body.item1,
      item2: req.body.item2,
    },
    userID: order.userID
  };
  let newOrders = orders.filter((x) => x.id != req.params.id);
  newOrders.push(orderWithItems);
  fs.writeFileSync("orders.json", JSON.stringify(newOrders));
  res.send(orderWithItems.items);
});

app.get("/orders/:id/items", (req, res) => {
  const allOrders = fs.readFileSync("orders.json");
  const orders = JSON.parse(allOrders);
  res.send(orders.find((elm) => elm.id == req.params.id).items);
});

app.put("/orders/:id/status", (req, res) => {
  const allOrders = fs.readFileSync("orders.json");
  const orders = JSON.parse(allOrders);
  const order = orders.find((elm) => elm.id == req.params.id);
  let orderWithStatus = {
    id: order.id,
    name: order.name,
    description: order.description,
    status: req.body.status,
    items: order.items,
    userID: order.userID
  };
  let newOrders = orders.filter((x) => x.id != req.params.id);
  newOrders.push(orderWithStatus);
  fs.writeFileSync("orders.json", JSON.stringify(newOrders));
  res.send(orderWithStatus.status);
})

app.get("/users/:userId/orders", (req, res) => {
  const allOrders = fs.readFileSync("orders.json");
  const orders = JSON.parse(allOrders);
  res.send(orders.filter((elm) => elm.userID == req.params.userId))
})

app.listen(PORT);