let mongoose = require('mongoose');

let schema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Category name is required"],
        trim: true
    },
    isDelete: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Tạo compound index để đảm bảo unique chỉ với các category không bị xóa
schema.index({ name: 1, isDelete: 1 }, { 
    unique: true,
    partialFilterExpression: { isDelete: false }
});

module.exports = new mongoose.model('category', schema);