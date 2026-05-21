const express = require('express');
const Event = require('../models/Event');

const router = express.Router();

// CREATE EVENT
router.post('/', async (req, res) => {
  try {
    const event = await Event.create(req.body);
    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({
      message: 'Error creating event',
      error: error.message,
    });
  }
});

// GET ALL EVENTS
router.get('/', async (req, res) => {
  try {
    const events = await Event.find().populate('categoryId');
    res.json(events);
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching events',
      error: error.message,
    });
  }
});

// GET EVENT BY ID
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate('categoryId');

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.json(event);
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching event',
      error: error.message,
    });
  }
});

// UPDATE EVENT
router.put('/:id', async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.json(event);
  } catch (error) {
    res.status(500).json({
      message: 'Error updating event',
      error: error.message,
    });
  }
});

// DELETE EVENT
router.delete('/:id', async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({
      message: 'Error deleting event',
      error: error.message,
    });
  }
});

module.exports = router;