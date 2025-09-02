require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const bodyParser = require('body-parser');
const socketIo = require('socket.io');

// Import Routes
const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboardRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const adminSurveyRoutes = require('./routes/adminSurveyRoutes');
const requestsRoutes = require("./routes/request");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: '*', // Change to frontend URL in production
        methods: ['GET', 'POST']
    }
});

// Make io available to routes
app.set('io', io);

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/admin', adminSurveyRoutes);
app.use("/api/requests", requestsRoutes);

// Socket.IO Events
io.on('connection', (socket) => {
    console.log('✅ New client connected');

    socket.on('disconnect', () => {
        console.log('❌ Client disconnected');
    });
});

// Start Server
const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
