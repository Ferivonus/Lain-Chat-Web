const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,  
    unique: true,    
    trim: true       
  },
  createdAt: {
    type: Date,
    default: Date.now  
  }
});

roomSchema.virtual('id').get(function() {
  return this._id.toHexString();
});

// Bu sanal alanın de serialize edilmesi için
roomSchema.set('toJSON', {
  virtuals: true,
});

// Modeli oluştur
const Room = mongoose.model('Room', roomSchema);

module.exports = Room;
