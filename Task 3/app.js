const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const app = express();
const PORT = 3000;

app.use(bodyParser.json());

app.post("/posts", (req, res) => {
  const allPosts = fs.readFileSync("posts.json");
  let posts = JSON.parse(allPosts);
  const newPost = {
    id: Date.now(),
    title: req.body.title,
    content: req.body.content,
    author: req.body.author,
    likes: 0,
    comments: [],
  };
  posts.push(newPost);
  fs.writeFileSync("posts.json", JSON.stringify(posts));
  res.send(newPost);
});

app.get("/posts", (req, res) => {
  const allPosts = fs.readFileSync("posts.json");
  let posts = JSON.parse(allPosts);
  res.send(posts);
});

app.get("/posts/:id", (req, res) => {
  const allPosts = fs.readFileSync("posts.json");
  let posts = JSON.parse(allPosts);
  const post = posts.find((p) => p.id == req.params.id);
  res.send(post);
});

app.put("/posts/:id", (req, res) => {
  const allPosts = fs.readFileSync("posts.json");
  let posts = JSON.parse(allPosts);
  const postIndex = posts.findIndex((p) => p.id == req.params.id);
  if (postIndex != -1) {
    posts[postIndex] = {
      ...posts[postIndex],
      title: req.body.title || posts[postIndex].title,
      content: req.body.content || posts[postIndex].content,
      author: req.body.author || posts[postIndex].author,
    };
    fs.writeFileSync("posts.json", JSON.stringify(posts));
    res.send(posts[postIndex]);
  } else {
    res.status(404).send({ message: "Post not found" });
  }
});

app.delete("/posts/:id", (req, res) => {
  const allPosts = fs.readFileSync("posts.json");
  let posts = JSON.parse(allPosts);
  const post = posts.find((elm) => elm.id == req.params)
  posts = posts.filter((p) => p.id != req.params.id);
  fs.writeFileSync("posts.json", JSON.stringify(posts));
  res.send(post);
});

app.post("/posts/:postId/comments", (req, res) => {
  const allPosts = fs.readFileSync("posts.json");
  let posts = JSON.parse(allPosts);
  const post = posts.find((p) => p.id == req.params.postId);
  if (post) {
    const newComment = {
      id: Date.now(),
      text: req.body.text,
      author: req.body.author,
    };
    post.comments.push(newComment);
    fs.writeFileSync("posts.json", JSON.stringify(posts));
    res.send(newComment);
  } else {
    res.status(404).send({ message: "Post not found" });
  }
});

app.get("/posts/:postId/comments", (req, res) => {
  const allPosts = fs.readFileSync("posts.json");
  let posts = JSON.parse(allPosts);
  const post = posts.find((p) => p.id == req.params.postId);
  res.send(post ? post.comments : []);
});

app.get("/posts/:postId/comments/:commentId", (req, res) => {
  const allPosts = fs.readFileSync("posts.json");
  let posts = JSON.parse(allPosts);
  const post = posts.find((p) => p.id == req.params.postId);
  if (post) {
    const comment = post.comments.find((c) => c.id == req.params.commentId);
    res.send(comment);
  } else {
    res.status(404).send({ message: "Post or comment not found" });
  }
});

app.put("/posts/:postId/comments/:commentId", (req, res) => {
  const allPosts = fs.readFileSync("posts.json");
  let posts = JSON.parse(allPosts);
  const post = posts.find((p) => p.id == req.params.postId);
  if (post) {
    const commentIndex = post.comments.findIndex(
      (c) => c.id == req.params.commentId
    );
    if (commentIndex != -1) {
      post.comments[commentIndex] = {
        ...post.comments[commentIndex],
        text: req.body.text || post.comments[commentIndex].text,
        author: req.body.author || post.comments[commentIndex].author,
      };
      fs.writeFileSync("posts.json", JSON.stringify(posts));
      res.send(post.comments[commentIndex]);
    } else {
      res.status(404).send({ message: "Comment not found" });
    }
  } else {
    res.status(404).send({ message: "Post not found" });
  }
});

app.delete("/posts/:postId/comments/:commentId", (req, res) => {
  const allPosts = fs.readFileSync("posts.json");
  let posts = JSON.parse(allPosts);
  const post = posts.find((p) => p.id == req.params.postId);
  if (post) {
    post.comments = post.comments.filter((c) => c.id != req.params.commentId);
    fs.writeFileSync("posts.json", JSON.stringify(posts));
    res.send(post);
  } else {
    res.status(404).send({ message: "Post not found" });
  }
});

app.post("/posts/:id/like", (req, res) => {
  const allPosts = fs.readFileSync("posts.json");
  let posts = JSON.parse(allPosts);
  const post = posts.find((p) => p.id == req.params.id);
  if (post) {
    post.likes += 1;
    fs.writeFileSync("posts.json", JSON.stringify(posts));
    res.send({ likes: post.likes });
  } else {
    res.status(404).send({ message: "Post not found" });
  }
});

app.post("/posts/:id/unlike", (req, res) => {
  const allPosts = fs.readFileSync("posts.json");
  let posts = JSON.parse(allPosts);
  const post = posts.find((p) => p.id == req.params.id);
  if (post) {
    post.likes -= 1;
    fs.writeFileSync("posts.json", JSON.stringify(posts));
    res.send({ likes: post.likes });
  } else {
    res.status(404).send({ message: "Post not found" });
  }
});

app.get("/posts/:postId/comments", (req, res) => {
  const allPosts = fs.readFileSync("posts.json");
  let posts = JSON.parse(allPosts);
  const post = posts.find((p) => p.id == req.params.postId);
  if (post) {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const result = post.comments.splice(startIndex, endIndex);
    res.send(result);
  } else {
    res.status(404).send({ message: "Post not found" });
  }
});

app.get("/posts", (req, res) => {
  const allPosts = fs.readFileSync("posts.json");
  let posts = JSON.parse(allPosts);
  const page = parseInt(req.query.page) || 1;
  console.log(page)
  const limit = parseInt(req.query.limit) || 10;
  console.log(limit)
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const result = posts.splice(startIndex, endIndex);
  console.log(startIndex, endIndex, result)
  res.send(result);
});

app.listen(PORT);
