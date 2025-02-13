const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
        credentials: true
    },
    allowEIO3: true,
    transports: ['websocket', 'polling']
});

// Serve static files
app.use(express.static('public'));

// Track connected users
let connectedUsers = 0;

// WebSocket connection handling
io.on('connection', (socket) => {
    console.log('User connected');
    connectedUsers++;
    io.emit('userCount', connectedUsers);

    // Handle drawing events
    socket.on('draw', (data) => {
        socket.broadcast.emit('draw', data);
    });

    // Handle clear canvas event
    socket.on('clear', () => {
        socket.broadcast.emit('clear');
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('User disconnected');
        connectedUsers--;
        io.emit('userCount', connectedUsers);
    });
});

// Start server
const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});