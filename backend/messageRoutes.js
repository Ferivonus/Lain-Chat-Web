const express = require('express');
const router = express.Router();
const Message = require('./models/Message');  // Mesaj modelini içe aktar

// Mesaj gönderme (POST)
router.post('/send', async (req, res) => {
  const { roomId, message } = req.body;  // Gelen body'den roomId ve message alınacak

  // Verilerin doğruluğunu kontrol et
  if (!roomId || !message) {
    return res.status(400).send({ error: 'Room ID ve mesaj gerekli.' });
  }

  try {
    // Yeni mesajı MongoDB'ye kaydet
    const newMessage = new Message({
      roomId: roomId,
      message: message,  // Corrected the typo here
    });

    await newMessage.save();

    console.log('Mesaj kaydedildi:', newMessage);
    res.status(200).send({ message: 'Mesaj alındı ve kaydedildi.', data: newMessage });  // Return the saved message
  } catch (err) {
    console.error('Mesaj kaydedilirken hata:', err);
    res.status(500).send({ error: 'Mesaj kaydedilirken hata oluştu.', details: err.message });
  }
});

// Mesajları alma (GET)
router.get('/:roomId', async (req, res) => {
  const { roomId } = req.params;  // URL parametresinden roomId alınacak

  if (!roomId) {
    return res.status(400).send({ error: 'Room ID gerekli.' });
  }

  try {
    // Room ID'ye göre mesajları çek ve sıralama işlemi
    const messages = await Message.find({ roomId: roomId }).sort({ timestamp: -1 });  // Sort by timestamp descending (newest first)

    if (messages.length === 0) {
      return res.status(404).send({ error: 'Mesaj bulunamadı.' });
    }

    console.log('Mesajlar:', messages);
    res.status(200).send({ messages: messages });
  } catch (err) {
    console.error('Mesajlar alınırken hata:', err);
    res.status(500).send({ error: 'Mesajlar alınırken hata oluştu.', details: err.message });
  }
});

module.exports = router;
