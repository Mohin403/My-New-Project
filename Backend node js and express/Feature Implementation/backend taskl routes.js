const express = require('express');
const Task = require('./models/Task');

const router = express.Router();

router.get('/tasks', async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
});

router.post('/tasks', async (req, res) => {
  const newTask = new Task(req.body);
  await newTask.save();
  res.status(201).json(newTask);
});

module.exports = router;
