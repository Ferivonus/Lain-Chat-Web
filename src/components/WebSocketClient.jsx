import axios from 'axios';

// Function to send messages to the API with the username
const sendMessageToAPI = async (roomId, message, username) => {
  try {
    const response = await axios.post('http://localhost:5000/api/messages/send', {  
      roomId: roomId,
      message: message,
      username: username,  // Include username in the request
    });
    console.log('Message successfully sent to the API:', response.data);
  } catch (error) {
    console.error('Error sending message to the API:', error);
  }
};

// Function to fetch messages from the API
const fetchMessagesFromAPI = async (roomId) => {
  try {
    const response = await axios.get(`http://localhost:5000/api/messages/${roomId}`);
    console.log('Fetched messages:', response.data.messages);
    return response.data.messages;
  } catch (error) {
    console.error('Error fetching messages from API:', error);
    return [];  // Return an empty array in case of error
  }
};

// WebSocket Client class to handle WebSocket connections and message sending
class WebSocketClient {
  constructor() {
    this.ws = null;
    this.onMessageCallback = null; 
    this.retryInterval = 5000;
  }

  connectToRoom(roomId, onMessageCallback) {
    if (!roomId) {
      console.error('Room ID is required to connect');
      return;
    }

    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      console.log('Already connected to the room');
      return;
    }

    if (this.ws) {
      this.disconnect();
    }

    const url = `ws://localhost:5001`; 
    this.ws = new WebSocket(url);

    this.ws.onopen = () => {
      console.log(`WebSocket connected to room ${roomId}`);
      this.ws.send(JSON.stringify({ action: 'joinRoom', roomId }));
    };

    this.ws.onmessage = (event) => {
      if (this.onMessageCallback) {
        this.onMessageCallback(event.data);
        // edit here it's working when message sended
      }
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    this.ws.onclose = () => {
      console.log('WebSocket disconnected from room', roomId);
      setTimeout(() => {
        this.connectToRoom(roomId, this.onMessageCallback); 
      }, this.retryInterval);
    };

    this.onMessageCallback = onMessageCallback;
  }

  sendMessage(roomId, message, username) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ roomId, message, username }));  // Send username with the message
      sendMessageToAPI(roomId, message, username);  // Also send to API
    } else {
      console.error('WebSocket connection is not open, retrying...');
      setTimeout(() => {
        this.connectToRoom(roomId, this.onMessageCallback); 
      }, this.retryInterval);
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  fetchMessages(roomId) {
    return fetchMessagesFromAPI(roomId);
  }
}

const websocketClient = new WebSocketClient();
export default websocketClient;
