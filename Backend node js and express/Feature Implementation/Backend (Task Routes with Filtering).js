router.get('/tasks', async (req, res) => {
  const { priority } = req.query;
  const filter = priority ? { priority } : {};
  const tasks = await Task.find(filter);
  res.json(tasks);
});
