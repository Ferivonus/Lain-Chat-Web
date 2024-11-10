import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import WebSocketClient from '../WebSocketClient';
import Cookies from 'js-cookie';  // Import js-cookie
import './RoomChat.css';  // Import CSS file

const RoomChat = () => {
  const { roomId } = useParams();  // Odanın ID'sini alıyoruz
  const [messages, setMessages] = useState([]);  // Mesajları saklamak için state
  const [newMessage, setNewMessage] = useState('');  // Yeni mesaj için state
  const [username, setUsername] = useState('');  // Kullanıcı adı için state

  useEffect(() => {
    // Kullanıcı adını çerezlerden al
    const storedUsername = Cookies.get('username');
    if (storedUsername) {
      setUsername(storedUsername);
    } else {
      console.error('Kullanıcı adı bulunamadı. Giriş yapmayı unutmayın.');
    }
  }, []);

  useEffect(() => {
    // WebSocket bağlantısı sağlanacak ve mesajlar dinlenecek
    WebSocketClient.connectToRoom(roomId, (message) => {
      // Mesaj geldiğinde gelen mesajı ekle
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    // Fetch messages from API when component mounts
    const fetchMessages = async () => {
      const fetchedMessages = await WebSocketClient.fetchMessages(roomId);
      // Ensure we are mapping over the fetched messages and extracting the message text
      setMessages(fetchedMessages.map(msg => msg.message));  // Update the state with the message text only
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
      WebSocketClient.sendMessage(roomId, newMessage, username);  // Pass username here
      setNewMessage('');  // Mesaj kutusunu temizle
    }
  };

  return (
    <div className="room-chat">
      <h2>Oda: {roomId}</h2>

      {/* Mesajlar */}
      <div className="messages">
        {messages.map((msg, index) => (
          <div key={index} className="message">
            <div className="message-content">
              {msg}
            </div>
          </div>
        ))}
      </div>

      {/* Yeni mesaj girişi */}
      <div className="input">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Mesajınızı yazın..."
        />
        <button
          onClick={handleSendMessage}
        >
          Gönder
        </button>
      </div>
    </div>
  );
};

export default RoomChat;
