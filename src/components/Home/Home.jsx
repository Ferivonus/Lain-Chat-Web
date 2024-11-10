import React, { useState, useEffect } from 'react';
import { fetchRooms, createRoom } from '../../services/api';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const [rooms, setRooms] = useState([]);
    const [newRoomName, setNewRoomName] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const loadRooms = async () => {
            try {
                const data = await fetchRooms();
                setRooms(data);
            } catch (err) {
                setError("Odalar yüklenirken bir hata oluştu.");
            }
        };
        loadRooms();
    }, []);

    const handleCreateRoom = async () => {
    if (newRoomName.trim()) {
        try {
            const room = await createRoom(newRoomName);
            console.log("Yeni oda yanıtı:", room);  // Burada yanıtı kontrol edelim
            setRooms([...rooms, { ...room, id: room._id }]);  // _id'yi id'ye çeviriyoruz
            setNewRoomName('');
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
                        {room.room_name}
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
            <button onClick={handleCreateRoom}>Oda Oluştur</button>
        </div>
    );
};

export default Home;
