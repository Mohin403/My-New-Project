import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [priority, setPriority] = useState('');

  useEffect(() => {
    axios.get(`http://localhost:5000/tasks?priority=${priority}`)
      .then(response => setTasks(response.data))
      .catch(error => console.error(error));
  }, [priority]);

  return (
    <div>
      <h2>Task List</h2>
      <select onChange={(e) => setPriority(e.target.value)}>
        <option value="">All</option>
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
      </select>
      <ul>
        {tasks.map(task => (
          <li key={task._id}>{task.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default TaskList;
