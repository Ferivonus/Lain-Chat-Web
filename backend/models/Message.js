const mongoose = require('mongoose');
const { Schema } = mongoose;

// Mesaj şeması
const messageSchema = new Schema({
  roomId: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

// Sanal 'id' alanı ekleyerek _id'yi id olarak döndür
messageSchema.virtual('id').get(function() {
  return this._id.toHexString();
});

// Bu sanal alanın de serialize edilmesi için
messageSchema.set('toJSON', {
  virtuals: true,
});

// Mesaj modelini oluştur
const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
