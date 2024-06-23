const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const app = express();
const PORT = 3000;

app.use(bodyParser.json());

app.post("/users", (req, res) => {
  let singleUser = {
    id: Date.now(),
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    profile: {
      bio: "",
      url: "",
    },
  };
  const allUsers = fs.readFileSync("users.json");
  const users = JSON.parse(allUsers);
  users.push(singleUser);
  fs.writeFileSync("users.json", JSON.stringify(users));
  res.send(singleUser);
});

app.get("/users", (req, res) => {
  try {
    const allUsers = fs.readFileSync("users.json");
    const result = JSON.parse(allUsers);
    res.send(result);
  } catch (err) {
    if (err.code == "ENOENT") {
      res.status(500).send("Something went wrong!");
    }
  }
});

app.get("/users/:id", (req, res) => {
  const allUsers = fs.readFileSync("users.json");
  const users = JSON.parse(allUsers);
  res.send(users.find((elm) => elm.id == req.params.id));
});

app.put("/users/:id", (req, res) => {
  const allUsers = fs.readFileSync("users.json");
  const users = JSON.parse(allUsers);
  const user = users.find((elm) => elm.id == req.params.id);
  let newUser = {
    id: user.id,
    name: req.body.name == undefined ? user.name : req.body.name,
    email: req.body.email == undefined ? user.email : req.body.email,
    password:
      req.body.password == undefined ? user.password : req.body.password,
  };
  let newUsers = users.filter((x) => x.id != req.params.id);
  newUsers.push(newUser);
  fs.writeFileSync("users.json", JSON.stringify(newUsers));
  res.send(newUser);
});

app.delete("/users/:id", (req, res) => {
  const allUsers = fs.readFileSync("users.json");
  const users = JSON.parse(allUsers);
  const user = users.find((elm) => elm.id == req.params.id);
  let newUsers = users.filter((x) => x.id != req.params.id);
  fs.writeFileSync("users.json", JSON.stringify(newUsers));
  res.send(user);
});

app.post("/users/:id/profile", (req, res) => {
  const allUsers = fs.readFileSync("users.json");
  const users = JSON.parse(allUsers);
  const user = users.find((elm) => elm.id == req.params.id);
  let userWithProfile = {
    id: user.id,
    name: user.name,
    email: user.email,
    password: user.password,
    profile: {
      bio: req.body.bio,
      url: req.body.url,
    },
  };
  let newUsers = users.filter((x) => x.id != req.params.id);
  newUsers.push(userWithProfile);
  fs.writeFileSync("users.json", JSON.stringify(newUsers));
  res.send(userWithProfile.profile);
});

app.get("/users/:id/profile", (req, res) => {
  const allUsers = fs.readFileSync("users.json");
  const users = JSON.parse(allUsers);
  res.send(users.find((elm) => elm.id == req.params.id).profile);
});

app.put("/users/:id/profile", (req, res) => {
  const allUsers = fs.readFileSync("users.json");
  const users = JSON.parse(allUsers);
  let user = users.find((elm) => elm.id == req.params.id);
  let newUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    password: user.password,
    profile: {
      bio: req.body.bio == undefined ? user.profile.bio : req.body.bio,
      url: req.body.url == undefined ? user.profile.url : req.body.url,
    },
  };
  let newUsers = users.filter((x) => x.id != req.params.id);
  newUsers.push(newUser);
  fs.writeFileSync("users.json", JSON.stringify(newUsers));
  res.send(newUser);
});

app.delete("/users/:id/profile", (req, res) => {
  const allUsers = fs.readFileSync("users.json");
  const users = JSON.parse(allUsers);
  const user = users.find((elm) => elm.id == req.params.id);
  const newUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    password: user.password,
    profile: {
      bio: "",
      url: "",
    },
  };
  let newUsers = users.filter((x) => x.id != req.params.id);
  newUsers.push(newUser);
  fs.writeFileSync("users.json", JSON.stringify(newUsers));
  res.send(newUser);
});

app.put("/users/:id/profile/picture", (req, res) => {
  const allUsers = fs.readFileSync("users.json");
  const users = JSON.parse(allUsers);
  const user = users.find((elm) => elm.id == req.params.id);
  const newUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    password: user.password,
    profile: {
      bio: user.profile.bio,
      url: req.body.url,
    },
  };
  let newUsers = users.filter((x) => x.id != req.params.id);
  newUsers.push(newUser);
  fs.writeFileSync("users.json", JSON.stringify(newUsers));
  res.send(newUser);
})

app.listen(PORT);
