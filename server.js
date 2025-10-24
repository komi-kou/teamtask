const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
});

app.use(cors());
app.use(express.json());

const authRoutes = require('./routes/auth');
const teamRoutes = require('./routes/team');
const dataRoutes = require('./routes/data');

app.use('/api/auth', authRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/data', dataRoutes);

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('join-team', (teamId) => {
    socket.join(teamId);
    console.log(`User ${socket.id} joined team ${teamId}`);
  });

  socket.on('leave-team', (teamId) => {
    socket.leave(teamId);
    console.log(`User ${socket.id} left team ${teamId}`);
  });

  socket.on('data-update', (data) => {
    const { teamId, type, update } = data;
    socket.to(teamId).emit('data-updated', { type, update });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = { app, io };