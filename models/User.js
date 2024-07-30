const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        trim: true,
        required: true
    },
    role: {
        type: String,
        default: 'buyer'
    },
    wishList: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
        }
    ],
    cart: [
        {
            product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
            cartItemId: { type: mongoose.Schema.Types.ObjectId, default: new mongoose.Types.ObjectId() }
        }
    ]
});

userSchema.plugin(passportLocalMongoose);

const User = mongoose.model('User', userSchema);

module.exports = User;