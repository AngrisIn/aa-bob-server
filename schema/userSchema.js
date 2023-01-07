const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: false
  },
  mobile: {
    type: String,
    required: true
  },
  photo: {
    type: Buffer,
    required: false,
    validate: {
      validator: function(value) {
        if(value==null)
            return true;
        // Check if the photo is a JPEG or PNG
        const allowedTypes = ['image/jpeg', 'image/png'];
        return allowedTypes.includes(value.contentType);
      },
      message: 'Invalid photo type. Only JPEG and PNG are allowed.'
    },
    maxlength: 500000 // 500KB
  },
  pin: {
    type: String,
    required: true
  },
  isLinked: {
    type: Boolean,
    required: true,
    default: false
  },
  trackingId: {
    type: String,
    default:null
  },
  referenceId: {
    type: String,
    default:null
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;