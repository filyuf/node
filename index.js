const express = require('express');
const path = require('path');
const itemsRouter = require('./routes/item.js');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Rute
app.use('/items', itemsRouter);

// Sajikan file index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});