import React, { useState, useEffect } from 'react';
import { fetchRooms, createRoom } from '../../services/api';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const [rooms, setRooms] = useState([]);
    const [newRoomName, setNewRoomName] = useState('');
    const [creatorUsername, setCreatorUsername] = useState('');  // New state for creator username
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const loadRooms = async () => {
            try {
                const data = await fetchRooms();
                console.log("Rooms data:", data); // Log rooms data to verify the field names
                setRooms(data);
            } catch (err) {
                setError("Odalar yüklenirken bir hata oluştu.");
            }
        };
        loadRooms();
    }, []);

    const handleCreateRoom = async () => {
        if (newRoomName.trim() && creatorUsername.trim()) {
            try {
                const room = await createRoom(newRoomName, creatorUsername);  // Pass creatorUsername
                console.log("Yeni oda yanıtı:", room);  // Log the response to confirm room creation
                setRooms([...rooms, { ...room, id: room._id, name: room.name, creator_username: room.creator_username }]);  // Add new room
                setNewRoomName('');
                setCreatorUsername('');
            } catch (err) {
                setError("Oda oluşturulurken bir hata oluştu.");
            }
        }
    };

    const handleEnterRoom = (roomId) => {
        navigate(`/room/${roomId}`);
    };

    return (
        <div>
            <h1>Odalar</h1>
            {error && <div style={{ color: 'red' }}>{error}</div>}
            <ul>
                {rooms.map((room) => (
                    <li key={room.id}>
                        <strong>Room Name:</strong> {room.name || "Room Name Unavailable"} <br />
                        <strong>Created by:</strong> {room.creator_username || "Unknown"} {/* Display creator's username */}
                        <button onClick={() => handleEnterRoom(room.id)}>Giriş Yap</button>
                    </li>
                ))}
            </ul>
            <input
                type="text"
                value={newRoomName}
                onChange={(e) => setNewRoomName(e.target.value)}
                placeholder="Yeni oda adı"
            />
            <input
                type="text"
                value={creatorUsername}
                onChange={(e) => setCreatorUsername(e.target.value)}
                placeholder="Oluşturan kullanıcı adı"
            />
            <button onClick={handleCreateRoom}>Oda Oluştur</button>
        </div>
    );
};

export default Home;
