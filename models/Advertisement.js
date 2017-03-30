const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const advertisementSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  forSale: {
    type: Boolean,
    default: true,
  },
  price: {
    type: Number,
    required: true,
  },
  picture: {
    type: String,
    default: '',
  },
  tags: {
    type: [
      {
        type: String,
        enum: ['work', 'lifestyle', 'motor', 'mobile'],
      },
    ],
    required: true,
  },
});

module.exports = mongoose.model('Advertisement', advertisementSchema);
