import mongoose from 'mongoose';
const { Schema } = mongoose;

const notificationSchema = new Schema({
  notificationId: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, enum: ['info', 'warning', 'success'], default: 'info' },
  read: { type: Boolean, default: false },
  recipient: { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

notificationSchema.index({ recipient: 1 });
notificationSchema.index({ notificationId: 1 });
export const Notification = mongoose.model('Notification', notificationSchema);
