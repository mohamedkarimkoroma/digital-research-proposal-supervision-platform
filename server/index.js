require('dotenv').config();
const express = require('express');
const cors = require('cors'); // Moved to the top
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const proposalRoutes = require('./routes/proposalRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const adminRoutes = require('./routes/adminRoutes');
const milestoneRoutes = require('./routes/milestoneRoutes');
const dns = require('dns');
dns.setServers(['1.1.1.1', '8.8.8.8']);

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors()); // Moved here! This must be BEFORE the routes
app.use(express.json());

// Serve uploaded files statically
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/proposals', proposalRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/milestones', milestoneRoutes);
app.use('/api/admin', adminRoutes);

app.get('/', (req, res) => {
  res.send('Hello, my backend is working!');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});