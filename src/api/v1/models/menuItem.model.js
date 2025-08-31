const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    imageUrl: {
        type: String,
        default: 'https://via.placeholder.com/150'
    },
    restaurant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant',
        required: true,
    },
}, { timestamps: true });

const MenuItem = mongoose.model('MenuItem', menuItemSchema);
module.exports = MenuItem;