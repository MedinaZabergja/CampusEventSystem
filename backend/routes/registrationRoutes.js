const express = require('express');
const Registration = require('../models/Registration');
const Event = require('../models/Event');

const router = express.Router();

// CREATE REGISTRATION
router.post('/', async (req, res) => {
  try {
    const { userId, eventId } = req.body;

    const existingRegistration = await Registration.findOne({
      userId,
      eventId,
      status: 'registered',
    });

    if (existingRegistration) {
      return res.status(400).json({
        message: 'User is already registered for this event.',
      });
    }

    const registration = await Registration.create({
      userId,
      eventId,
    });

    const event = await Event.findById(eventId);

  if (!event) {
    return res.status(404).json({
     message: 'Event not found.',
    });
  }

  const registrationCount = await Registration.countDocuments({
    eventId,
    status: 'registered',
  });

  if (registrationCount >= event.capacity) {
    return res.status(400).json({
      message: 'This event is already full.',
    });
  }

    res.status(201).json(registration);
  } catch (error) {
    res.status(500).json({
      message: 'Error creating registration',
      error: error.message,
    });
  }
});

// GET ALL REGISTRATIONS
router.get('/', async (req, res) => {
  try {
    const registrations = await Registration.find()
      .populate('userId', 'fullName email role')
      .populate('eventId');

    res.json(registrations);
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching registrations',
      error: error.message,
    });
  }
});

// CANCEL REGISTRATION
router.put('/:id/cancel', async (req, res) => {
  try {
    const registration = await Registration.findByIdAndUpdate(
      req.params.id,
      { status: 'cancelled' },
      { new: true }
    );

    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }

    res.json(registration);
  } catch (error) {
    res.status(500).json({
      message: 'Error cancelling registration',
      error: error.message,
    });
  }
});

// DELETE REGISTRATION
router.delete('/:id', async (req, res) => {
  try {
    const registration = await Registration.findByIdAndDelete(req.params.id);

    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }

    res.json({ message: 'Registration deleted successfully' });
  } catch (error) {
    res.status(500).json({
      message: 'Error deleting registration',
      error: error.message,
    });
  }
});

module.exports = router;

router.delete('/:userId/:eventId', async (req, res) => {
  try {
    const { userId, eventId } = req.params;

    const deletedRegistration =
      await Registration.findOneAndDelete({
        userId,
        eventId,
      });

    if (!deletedRegistration) {
      return res.status(404).json({
        message: 'Registration not found.',
      });
    }

    res.json({
      message:
        'Successfully unregistered from event.',
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});