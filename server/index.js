const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('./routes/authRoutes');
const apiRoutes = require('./routes/apiRoutes');

app.use('/api/auth', authRoutes);
app.use('/api', apiRoutes); // Dashboard, Finance, etc.

// Root Endpoint
app.get('/', (req, res) => {
    res.send('Mini ERP API is running...');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
