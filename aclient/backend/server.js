const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const documentsRoutes = require('./routes/documents');
const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard'); // ✅ import dashboard route

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use('/api/auth', authRoutes);
app.use('/api/documents', documentsRoutes);
app.use('/api/dashboard', dashboardRoutes); // ✅ mount dashboard route

app.listen(5000, () => console.log('Server running on port 5000'));
