import React, { useState, useEffect } from 'react';
import { fetchRooms, createRoom } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const Home = () => {
    const [rooms, setRooms] = useState([]);
    const [newRoomName, setNewRoomName] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Çerezden creator username bilgisini alıyoruz
    const creatorUsername = Cookies.get('username');

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
        if (!newRoomName.trim()) {
            setError("Room name is required.");
            return;
        }

        if (!creatorUsername) {
            setError("Creator username is required. Please log in.");
            return;
        }
        
        console.log("Creating room with:", newRoomName, creatorUsername);

        try {
            const newRoom = await createRoom(newRoomName, creatorUsername);
            setRooms((prevRooms) => [...prevRooms, { 
                id: newRoom._id, 
                name: newRoom.name, 
                creator_username: newRoom.creator_username,
                createdAt: newRoom.createdAt
            }]);
            setNewRoomName('');
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
                        <strong>Created At:</strong> {new Date(room.createdAt).toLocaleString()}
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
            <button onClick={handleCreateRoom}>Create Room</button>
        </div>
    );
};

export default Home;
