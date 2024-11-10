import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import WebSocketClient from '../WebSocketClient';

const RoomChat = () => {
  const { roomId } = useParams();  // Odanın ID'sini alıyoruz
  const [messages, setMessages] = useState([]);  // Mesajları saklamak için state
  const [newMessage, setNewMessage] = useState('');  // Yeni mesaj için state

  useEffect(() => {
    // WebSocket bağlantısı sağlanacak ve mesajlar dinlenecek
    WebSocketClient.connectToRoom(roomId, (message) => {
      // Mesaj geldiğinde gelen mesajı ekle
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    // Fetch messages from API when component mounts
    const fetchMessages = async () => {
      const fetchedMessages = await WebSocketClient.fetchMessages(roomId);
      setMessages(fetchedMessages);  // Update the state with the fetched messages
    };

    // Fetch initial messages
    fetchMessages();

    return () => {
      // Bileşen unmont edildiğinde WebSocket bağlantısını kes
      WebSocketClient.disconnect();
    };
  }, [roomId]);

  // Mesaj gönderme fonksiyonu
  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // Yeni mesajı WebSocket üzerinden gönder
      WebSocketClient.sendMessage(roomId, newMessage);  
      setNewMessage('');  // Mesaj kutusunu temizle
    }
  };

  return (
    <div className="room-chat">
      <h2>Oda: {roomId}</h2>

      {/* Mesajlar */}
      <div className="messages" style={{ maxHeight: '400px', overflowY: 'scroll', padding: '10px', border: '1px solid #ccc', borderRadius: '8px' }}>
        {messages.map((msg, index) => (
          <div key={index} className="message" style={{ marginBottom: '10px' }}>
            {/* Her mesajı sağa veya sola hizalamak için basit bir kontrol ekledim */}
            <div style={{
              backgroundColor: '#f1f1f1',
              padding: '8px 12px',
              borderRadius: '20px',
              maxWidth: '70%',
              marginLeft: 'auto',  // Sağ hizalama
              textAlign: 'left',
              wordBreak: 'break-word'
            }}>
              {msg}
            </div>
          </div>
        ))}
      </div>

      {/* Yeni mesaj girişi */}
      <div className="input" style={{ display: 'flex', marginTop: '10px' }}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Mesajınızı yazın..."
          style={{
            flex: 1,
            padding: '10px',
            borderRadius: '20px',
            border: '1px solid #ccc',
            marginRight: '10px'
          }}
        />
        <button
          onClick={handleSendMessage}
          style={{
            padding: '10px 15px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '20px',
            cursor: 'pointer'
          }}
        >
          Gönder
        </button>
      </div>
    </div>
  );
};

export default RoomChat;
