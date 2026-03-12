import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    tenantId: {
        type: String,
        ref: "Tenant",
        required: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['admin', 'user', 'viewer'],
        default: 'user'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

userSchema.index({ tenantId: 1, email: 1 }, { unique: true });

const User = mongoose.model("User", userSchema);

export default User;