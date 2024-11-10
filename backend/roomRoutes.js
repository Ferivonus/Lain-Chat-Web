// roomRoutes.js
const express = require('express');
const router = express.Router();
const Room = require('./models/Room'); // Import Room model

// Get all rooms
router.get('/', async (req, res) => {
  try {
    const rooms = await Room.find();  // Fetch all rooms from MongoDB
    res.status(200).json(rooms);
  } catch (error) {
    res.status(500).send('Error fetching rooms');
  }
});

router.post('/', async (req, res) => {
    const { room_name } = req.body;

    // Check if room name is provided
    if (!room_name || room_name.trim() === '') {
        return res.status(400).send('Room name is required');
    }

    try {
        const newRoom = new Room({ name: room_name });
        await newRoom.save();
        res.status(201).json(newRoom); // Respond with the newly created room
    } catch (err) {
        res.status(500).send('Error creating room');
    }
});

// Optional: Add more routes for updating/deleting rooms as needed

module.exports = router;
