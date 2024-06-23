const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const app = express();
const PORT = 3000;

app.use(bodyParser.json());

app.post("/projects", (req, res) => {
  let newProject = {
    id: Date.now(),
    name: req.body.name,
    description: req.body.description,
    tasks: {},
  };
  const allProjects = fs.readFileSync("projects.json");
  const projects = JSON.parse(allProjects);
  projects.push(newProject);
  fs.writeFileSync("projects.json", JSON.stringify(projects));
  res.send(newProject);
});

app.get("/projects", (req, res) => {
  try {
    const allProjects = fs.readFileSync("projects.json");
    const projects = JSON.parse(allProjects);
    res.send(projects);
  } catch (err) {
    if (err.code == "ENOENT") {
      res.status(500).send("Something went wrong!");
    }
  }
});

app.get("/projects/:id", (req, res) => {
  const allProjects = fs.readFileSync("projects.json");
  const projects = JSON.parse(allProjects);
  res.send(projects.find((elm) => elm.id == req.params.id));
});

app.put("/projects/:id", (req, res) => {
  const allProjects = fs.readFileSync("projects.json");
  const projects = JSON.parse(allProjects);
  const project = projects.find((elm) => elm.id == req.params.id);
  let newProject = {
    id: project.id,
    name: req.body.name == undefined ? project.name : req.body.name,
    description: req.body.description == undefined ? project.description : req.body.description,
    tasks: project.tasks
  };
  let newProjects = projects.filter((x) => x.id != req.params.id);
  newProjects.push(newProject);
  fs.writeFileSync("projects.json", JSON.stringify(newProjects));
  res.send(newProject);
});

app.delete("/projects/:id", (req, res) => {
  const allProjects = fs.readFileSync("projects.json");
  const projects = JSON.parse(allProjects);
  const project = projects.find((elm) => elm.id == req.params.id);
  let newProjects = projects.filter((x) => x.id != req.params.id);
  fs.writeFileSync("projects.json", JSON.stringify(newProjects));
  res.send(project);
});

app.post("/projects/:projectId/tasks", (req, res) => {
  const allProjects = fs.readFileSync("projects.json");
  const projects = JSON.parse(allProjects);
  const project = projects.find((elm) => elm.id == req.params.id);
  let a = req.body.tasks
  console.log(a.task1)
  let projectWithTasks = {
    id: project.id,
    name: project.name,
    description: project.description,
    tasks: {
      task1: req.body.tasks.task1,
      task2: req.body.tasks.task2,
    },
  };
  let newProjects = projects.filter((x) => x.id != req.params.id);
  newProjects.push(projectWithTasks);
  fs.writeFileSync("projects.json", JSON.stringify(newProjects));
  res.send(projectWithTasks.tasks);
});

app.get("/projects/:projectId/tasks", (req, res) => {
  const allProjects = fs.readFileSync("projects.json");
  const projects = JSON.parse(allProjects);
  res.send(projects.find((elm) => elm.id == req.params.id).tasks);
});

app.get("/projects/:projectId/tasks/:taskId", (req, res) => {
  const allProjects = fs.readFileSync("projects.json");
  const projects = JSON.parse(allProjects);
  const taskID = req.params.taskId
  res.send(projects.find((elm) => elm.id == req.params.id).tasks.taskID);
});

app.put("/projects/:projectId/tasks/:taskId", (req, res) => {
  const allProjects = fs.readFileSync("projects.json");
  const projects = JSON.parse(allProjects);
  let project = projects.find((elm) => elm.id == req.params.id);
  let newProject = {
    id: project.id,
    name: project.name,
    description: project.description,
    tasks: {
      task1: req.body.tasks.task1 == undefined ? project.tasks.task1 : req.body.task1,
      task2: req.body.tasks.task2 == undefined ? project.tasks.task2 : req.body.task2,
    },
  };
  let newProjects = projects.filter((x) => x.id != req.params.id);
  newProjects.push(newProject);
  fs.writeFileSync("projects.json", JSON.stringify(newProjects));
  res.send(newProject);
});

app.delete("/projects/:projectId/tasks/:taskId", (req, res) => {
  const allProjects = fs.readFileSync("projects.json");
  const projects = JSON.parse(allProjects);
  const project = projects.find((elm) => elm.id == req.params.id);
  const newProject = {
    id: project.id,
    name: project.name,
    description: project.description,
    tasks: {
      task1: req.params.taskId != "task1" ? project.tasks.task1 : "",
      task2: req.params.taskId != "task2" ? project.tasks.task2 : "",
    },
  };
  let newProjects = projects.filter((x) => x.id != req.params.id);
  newProjects.push(newProject);
  fs.writeFileSync("projects.json", JSON.stringify(newProjects));
  res.send(newProject);
});

app.listen(PORT);
