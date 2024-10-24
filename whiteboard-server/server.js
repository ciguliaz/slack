const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let whiteboardData = [];
let whiteboardList = {};
/*
{
  id:"{this is id string}",
  whiteboardData:[],
  role:{
    admin:"{user id}",
    presentor:{},
    }
}
*/
let currentClient = 0;
let peakClient = 0;

// Define allowed origins
const allowedOrigins = [
  "https://collab-whiteboard.up.railway.app/",
  "http://localhost:3000",
  "http://localhost:3001"
];

// Function to broadcast messages to all clients except the sender
const broadcast = (ws, data) => {
  wss.clients.forEach((client) => {
    if (client !== ws && client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
};

// WebSocket connection
wss.on('connection', (ws) => {

  const origin = request.headers.origin;

  // Check if the origin is allowed
  if (!allowedOrigins.includes(origin)) {
    ws.close();  // Close the WebSocket connection if origin is not allowed
    console.log(`Connection rejected from origin: ${origin}`);
    return;
  }

  currentClient += 1;
  peakClient = Math.max(peakClient, currentClient);
  console.log(`[ + ] Client connected from ${origin}.\n
    Current: ${currentClient}. Peak: ${peakClient}.`);

  // Send the shape history to the newly connected client
  ws.send(JSON.stringify({ type: 'history', data: whiteboardData }));

  ws.on('message', (message) => {
    const data = JSON.parse(message);

    // Handle create room
    if (data.type === 'createRoom') {
      //TODO: anyany
      const { name, userId, roomId} = data;
    }

    // Handle user joining a room (since WebSocket doesn’t support rooms, you'll have to handle this manually)
    // ! this is not done
    if (data.type === 'userJoined') {
      const { name, userId, roomId} = data;
      ws.roomId = roomId; // You can store the room ID in the WebSocket object
      ws.send(JSON.stringify({ type: 'userIsJoined', success: true }));
    }

    // Handle drawing event
    if (data.type === 'drawing') {
      whiteboardData.push(data);
      broadcast(ws, data); // Broadcast drawing data to all other clients
    }

    // Handle clearing the canvas
    if (data.type === 'clearCanvas') {
      whiteboardData = [];
      broadcast(ws, { type: 'clearCanvas' }); // Broadcast clear canvas to all clients
    }
  });

  ws.on('close', () => {
    currentClient -= 1;
    console.log(`[ - ] Client disconnected from origin: ${origin}.\n
      Current: ${currentClient}. Peak: ${peakClient}.`);
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
