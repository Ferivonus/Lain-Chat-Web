import React, { useState, useEffect } from 'react';
import { fetchRooms, createRoom } from '../../services/api';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const [rooms, setRooms] = useState([]);
    const [newRoomName, setNewRoomName] = useState('');
    const [creatorUsername, setCreatorUsername] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const loadRooms = async () => {
            try {
                const data = await fetchRooms();
                setRooms(data);
            } catch (err) {
                setError("An error occurred while loading rooms.");
            }
        };
        loadRooms();
    }, []);

    const handleCreateRoom = async () => {
        if (!newRoomName.trim() || !creatorUsername.trim()) {
            setError("Room name and creator username are required.");
            return;
        }

        try {
            const newRoom = await createRoom(newRoomName, creatorUsername);
            setRooms((prevRooms) => [...prevRooms, { 
                id: newRoom._id, 
                name: newRoom.name, 
                creator_username: newRoom.creator_username,
                createdAt: newRoom.createdAt
            }]);
            setNewRoomName('');
            setCreatorUsername('');
            setError('');
        } catch (err) {
            setError("An error occurred while creating the room.");
        }
    };

    const handleEnterRoom = (roomId) => {
        navigate(`/room/${roomId}`);
    };

    return (
        <div>
            <h1>Rooms</h1>
            {error && <div style={{ color: 'red' }}>{error}</div>}
            <ul>
                {rooms.map((room) => (
                    <li key={room.id}>
                        <strong>Room Name:</strong> {room.name || "Unavailable"} <br />
                        <strong>Created by:</strong> {room.creator_username || "Unknown"} <br />
                        <strong>Created At:</strong> {new Date(room.createdAt).toLocaleString()} {/* Display formatted date */}
                        <button onClick={() => handleEnterRoom(room.id)}>Enter Room</button>
                    </li>
                ))}
            </ul>
            <input
                type="text"
                value={newRoomName}
                onChange={(e) => setNewRoomName(e.target.value)}
                placeholder="New Room Name"
            />
            <input
                type="text"
                value={creatorUsername}
                onChange={(e) => setCreatorUsername(e.target.value)}
                placeholder="Creator Username"
            />
            <button onClick={handleCreateRoom}>Create Room</button>
        </div>
    );
};

export default Home;
