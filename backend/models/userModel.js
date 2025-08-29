import mongoose from 'mongoose';
const { Schema } = mongoose;

const userSchema = new Schema({
  userId: { type: String, required: true, unique: true }, // cuid/uuid
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  profilePhoto: { type: String },
  location: { type: String },
  socialLinks: { type: Map, of: String }, // dynamic key-value
  socialLogin: { type: Map, of: String },
  socialVerified: { type: Boolean, default: false },
}, { timestamps: true });

userSchema.index({ email: 1 });
userSchema.index({ userId: 1 });

export const User = mongoose.model('User', userSchema);
