const express = require('express');
require('dotenv').config();

const app = express();
app.use(express.json());

// Routes
const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);

const recordRoutes = require('./routes/recordRoutes');
app.use('/api/records', recordRoutes);

// DB Connection
const connectDB = require('./config/db');

// Start server ONLY after DB connects
connectDB().then(() => {
  app.listen(5000, () => {
    console.log("Server started on http://localhost:5000");
  });
});
