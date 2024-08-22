const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config(); // Load environment variables from a .env file

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

 


// Middleware
app.use(cors());
app.use(bodyParser.json());

// Blog schema and model
const blogSchema = new mongoose.Schema({
  title: String,
  link: String
});

const Blog = mongoose.model('Blog', blogSchema);

// Project schema and model
const projectSchema = new mongoose.Schema({
  title: String,
  link: String
});

const Project = mongoose.model('Project', projectSchema);

// Blog Routes

// POST route to add a blog
app.post('/api/blogs', async (req, res) => {
  try {
    const { title, link } = req.body;
    const newBlog = new Blog({ title, link });
    await newBlog.save();
    res.status(201).json(newBlog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET route to fetch all blogs
app.get('/api/blogs', async (req, res) => {
  try {
    const blogs = await Blog.find();
    res.status(200).json(blogs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE route to remove a blog by ID
app.delete('/api/blogs/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Blog.findByIdAndDelete(id);
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Project Routes

// POST route to add a project
app.post('/api/projects', async (req, res) => {
  try {
    const { title, link } = req.body;
    if (!title || !link) {
      return res.status(400).json({ message: 'Title and link are required' });
    }
    const newProject = new Project({ title, link });
    await newProject.save();
    res.status(201).json(newProject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET route to fetch all projects
app.get('/api/projects', async (req, res) => {
  try {
    const projects = await Project.find();
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE route to remove a project by ID
app.delete('/api/projects/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Project.findByIdAndDelete(id);
    if (!result) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
