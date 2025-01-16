const express = require('express');
const multer = require('multer');
const pool = require('../db');
const router = express.Router();

// Konfigurasi multer untuk upload gambar
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

// CREATE
router.post('/', upload.single('image'), async (req, res) => {
  const { name, description } = req.body;
  const imageUrl = req.file.path;

  try {
    const [result] = await pool.query('INSERT INTO items (name, description, imageUrl) VALUES (?, ?, ?)', [name, description, imageUrl]);
    res.status(201).json({ id: result.insertId, name, description, imageUrl });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// READ
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM items');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// UPDATE
router.put('/:id', upload.single('image'), async (req, res) => {
  const { name, description } = req.body;
  const imageUrl = req.file ? req.file.path : undefined;

  try {
    const [result] = await pool.query('UPDATE items SET name = ?, description = ?, imageUrl = ? WHERE id = ?', [name, description, imageUrl, req.params.id]);
    res.json({ id: req.params.id, name, description, imageUrl });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE
router.delete('/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM items WHERE id = ?', [req.params.id]);
    res.json({ message: 'Item deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;