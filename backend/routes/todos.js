const express = require('express');
const { body, validationResult } = require('express-validator');
const Todo = require('../models/Todo');
const auth = require('../middleware/auth');

const router = express.Router();

// GET all todos for current user
router.get('/', auth, async (req, res) => {
  try {
    const { completed, priority, category, search } = req.query;
    const filter = { user: req.user._id };

    if (completed !== undefined) filter.completed = completed === 'true';
    if (priority) filter.priority = priority;
    if (category) filter.category = category;
    if (search) filter.title = { $regex: search, $options: 'i' };

    const todos = await Todo.find(filter).sort({ createdAt: -1 });
    res.json(todos);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// CREATE todo
router.post('/', auth, [
  body('title').trim().notEmpty().withMessage('Title is required').isLength({ max: 200 }),
  body('priority').optional().isIn(['low', 'medium', 'high']),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ message: errors.array()[0].msg });

  try {
    const { title, description, priority, category, dueDate } = req.body;
    const todo = await Todo.create({ user: req.user._id, title, description, priority, category, dueDate });
    res.status(201).json(todo);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// UPDATE todo
router.put('/:id', auth, async (req, res) => {
  try {
    const todo = await Todo.findOne({ _id: req.params.id, user: req.user._id });
    if (!todo) return res.status(404).json({ message: 'Todo not found' });

    const { title, description, completed, priority, category, dueDate } = req.body;
    if (title !== undefined) todo.title = title;
    if (description !== undefined) todo.description = description;
    if (completed !== undefined) todo.completed = completed;
    if (priority !== undefined) todo.priority = priority;
    if (category !== undefined) todo.category = category;
    if (dueDate !== undefined) todo.dueDate = dueDate;

    await todo.save();
    res.json(todo);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE todo
router.delete('/:id', auth, async (req, res) => {
  try {
    const todo = await Todo.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!todo) return res.status(404).json({ message: 'Todo not found' });
    res.json({ message: 'Todo deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE all completed
router.delete('/bulk/completed', auth, async (req, res) => {
  try {
    await Todo.deleteMany({ user: req.user._id, completed: true });
    res.json({ message: 'Completed todos cleared' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET stats
router.get('/stats/summary', auth, async (req, res) => {
  try {
    const total = await Todo.countDocuments({ user: req.user._id });
    const completed = await Todo.countDocuments({ user: req.user._id, completed: true });
    const high = await Todo.countDocuments({ user: req.user._id, priority: 'high', completed: false });
    res.json({ total, completed, pending: total - completed, highPriority: high });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
