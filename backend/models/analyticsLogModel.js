import mongoose from 'mongoose';
const { Schema } = mongoose;

const activityLogSchema = new Schema({
  logId: { type: String, required: true, unique: true },
  action: { type: String, required: true }, // 'created', 'updated', 'deleted', etc.
  entityType: { type: String, required: true }, // 'task', 'note', 'event', etc.
  entityId: { type: String, required: true },
  details: { type: String },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

activityLogSchema.index({ user: 1 });
activityLogSchema.index({ logId: 1 });
export const ActivityLog = mongoose.model('ActivityLog', activityLogSchema);
