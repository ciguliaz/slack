const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Prepare for all drawing data saved
let whiteboardData = [];

io.on('connection', (socket) => {
  //Handle Login
  socket.on("userJoined",(data)=>{
    const {name, userId, roomId, host, presenter}=data;
    socket.join(roomId);
    socket.emit("userIsJoined",{success:true});
  });
  //

  // Send the shape history to the newly connected client
  socket.emit('history', whiteboardData);

  socket.on('drawing', (data) => {
    // Save the drawing data to the history
    whiteboardData.push(data);

    // Broadcast the entire data object, including the points
    socket.broadcast.emit('drawing', data);
  });

  // Listen for the clearCanvas event and broadcast it to all users
  socket.on('clearCanvas', () => {
    whiteboardData = [];
    socket.broadcast.emit('clearCanvas');
  });


  socket.on('disconnect', () => console.log('Client disconnected'));
});

const PORT = 4000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
