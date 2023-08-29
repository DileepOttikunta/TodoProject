const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Connect to MongoDB
mongoose.connect('mongodb+srv://dileepottikunta:OalWh9HVzlHzFLRE@dileep.eapbkf5.mongodb.net/', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Create a schema for tasks
const taskSchema = new mongoose.Schema({
  text: String,
  completed: Boolean,
});

const Task = mongoose.model('Task', taskSchema);

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', async (req, res) => {
  try {
    const tasks = await Task.find();
    res.render('index', { tasks });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/add', async (req, res) => {
  const { taskText } = req.body;
  const newTask = new Task({
    text: taskText,
    completed: false,
  });
  try {
    await newTask.save();
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});
// ...

app.post('/toggle', async (req, res) => {
    const { taskId } = req.body;
    try {
      const task = await Task.findById(taskId);
      if (task) {
        task.completed = !task.completed;
        await task.save();
      }
      res.redirect('/');
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
  });
  
  app.post('/remove', async (req, res) => {
    const { taskId } = req.body;
    try {
      await Task.findByIdAndRemove(taskId);
      res.redirect('/');
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
  });
  
  // ...
  

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
