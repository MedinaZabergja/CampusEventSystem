const express = require('express');
const Category = require('../models/Category');

const router = express.Router();

// CREATE CATEGORY
router.post('/', async (req, res) => {
  try {
    const category = await Category.create(req.body);
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({
      message: 'Error creating category',
      error: error.message,
    });
  }
});

// GET ALL CATEGORIES
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching categories',
      error: error.message,
    });
  }
});

// GET CATEGORY BY ID
router.get('/:id', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        message: 'Category not found',
      });
    }

    res.json(category);
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching category',
      error: error.message,
    });
  }
});

// UPDATE CATEGORY
router.put('/:id', async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!category) {
      return res.status(404).json({
        message: 'Category not found',
      });
    }

    res.json(category);
  } catch (error) {
    res.status(500).json({
      message: 'Error updating category',
      error: error.message,
    });
  }
});

// DELETE CATEGORY
router.delete('/:id', async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);

    if (!category) {
      return res.status(404).json({
        message: 'Category not found',
      });
    }

    res.json({
      message: 'Category deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error deleting category',
      error: error.message,
    });
  }
});

module.exports = router;