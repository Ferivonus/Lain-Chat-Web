// server.js
const express = require('express');
const cors = require('cors');
const WebSocket = require('ws');
const mongoose = require('mongoose');

const messageRoutes = require('./messageRoutes');
const authRoutes = require('./authRoutes');
const roomRoutes = require('./roomRoutes');  // Import roomRoutes

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// CORS ayarları
const corsOptions = {
  origin: 'http://localhost:3000', // Adjust this according to your frontend URL
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.use(express.json());

// WebSocket kurulumu
const wss = new WebSocket.Server({ 
  port: 5001, 
  verifyClient: (info, done) => {
    // Check the origin of the WebSocket connection (e.g., to allow only requests from http://localhost:3000)
    const allowedOrigins = ['http://localhost:3000']; 
    if (allowedOrigins.includes(info.origin)) {
      done(true); // Allow connection
    } else {
      done(false, 403, 'Forbidden'); // Reject connection
    }
  }
});
wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    console.log('received: %s', message);
  });

  ws.send('WebSocket bağlantısı kuruldu');
});

// API rotaları
app.use('/api/messages', messageRoutes);  // Mesajlarla ilgili API
app.use('/api/auth', authRoutes);        // Login ve Register API
app.use('/api/rooms', roomRoutes);       // Yeni 'rooms' API

// MongoDB bağlantısı
const uri = process.env.DB_URI;  // Fetch the DB_URI from environment variables

console.log('DB URI:', uri);  // Log the URI to ensure it's loaded properly

// Connect to MongoDB
mongoose.connect(uri)
  .then(() => console.log('MongoDB veritabanına bağlanıldı'))
  .catch(err => console.log('MongoDB bağlantı hatası:', err));

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
