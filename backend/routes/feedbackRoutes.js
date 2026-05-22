const express = require('express');
const Feedback = require('../models/Feedback');

const router = express.Router();

// CREATE FEEDBACK
router.post('/', async (req, res) => {
  try {
    const { userId, eventId, rating, comment } = req.body;

    const existingFeedback = await Feedback.findOne({
      userId,
      eventId,
    });

    if (existingFeedback) {
      return res.status(400).json({
        message: 'You have already reviewed this event.',
      });
    }

    const feedback = await Feedback.create({
      userId,
      eventId,
      rating,
      comment,
    });

    res.status(201).json(feedback);
  } catch (error) {
    res.status(500).json({
      message: 'Error creating feedback',
      error: error.message,
    });
  }
});

// GET ALL FEEDBACK
router.get('/', async (req, res) => {
  try {
    const feedbacks = await Feedback.find()
      .populate('userId', 'fullName email role')
      .populate('eventId');

    res.json(feedbacks);
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching feedback',
      error: error.message,
    });
  }
});

// GET FEEDBACK BY EVENT
router.get('/event/:eventId', async (req, res) => {
  try {
    const feedbacks = await Feedback.find({ eventId: req.params.eventId })
      .populate('userId', 'fullName email role')
      .populate('eventId');

    res.json(feedbacks);
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching event feedback',
      error: error.message,
    });
  }
});

// UPDATE FEEDBACK
router.put('/:id', async (req, res) => {
  try {
    const feedback = await Feedback.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }

    res.json(feedback);
  } catch (error) {
    res.status(500).json({
      message: 'Error updating feedback',
      error: error.message,
    });
  }
});

// DELETE FEEDBACK
router.delete('/:id', async (req, res) => {
  try {
    const feedback = await Feedback.findByIdAndDelete(req.params.id);

    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }

    res.json({ message: 'Feedback deleted successfully' });
  } catch (error) {
    res.status(500).json({
      message: 'Error deleting feedback',
      error: error.message,
    });
  }
});

module.exports = router;