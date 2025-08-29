import mongoose from 'mongoose';
const { Schema } = mongoose;

const eventSchema = new Schema({
  eventId: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  isAllDay: { type: Boolean, default: false },
  owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

eventSchema.index({ owner: 1 });
eventSchema.index({ eventId: 1 });
export const Event = mongoose.model('Event', eventSchema);