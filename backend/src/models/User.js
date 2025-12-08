const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

const UserSchema = new Schema({
    fullname: {
        type: String,
        required: [true, 'Full name is required'],
        trim: true,
        minlength: [3, 'Full name must be at least 3 characters'],
        maxlength: [100, 'Full name cannot exceed 100 characters'],
    },

    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        index: true,
    },

    password: {
        type: String,
        required: [true, 'Password is required'],
        select: false, // Ne pas retourner le password par défaut
    },

    role: {
        type: String,
        enum: {
            values: ['admin', 'chauffeur'],
            message: '{VALUE} is not a valid role'
        },
        default: 'chauffeur',
        index: true,
    },

    telephone: {
        type: String,
        required: [true, 'Phone number is required'],
        trim: true,
        index: true,
    },

    status: {
        type: String,
        enum: {
            values: ['active', 'inactive'],
            message: '{VALUE} is not a valid status'
        },
        default: 'active',
        index: true,
    },
}, {
    timestamps: true,
});

// Hash du mot de passe avant sauvegarde
UserSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

// Méthode pour comparer les mots de passe
UserSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("User", UserSchema);
