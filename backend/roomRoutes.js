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

// Create a new room
router.post('/', async (req, res) => {
    const { room_name, creator_username } = req.body;

    // Check if room_name and creator_username are provided
    if (!room_name || room_name.trim() === '') {
        return res.status(400).send('Room name is required');
    }
    if (!creator_username || creator_username.trim() === '') {
        return res.status(400).send('Creator username is required');
    }

    try {
        const newRoom = new Room({ name: room_name, creator_username });
        await newRoom.save();
        res.status(201).json(newRoom); // Respond with the newly created room
    } catch (err) {
        res.status(500).send('Error creating room');
    }
});

module.exports = router;
