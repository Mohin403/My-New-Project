import mongoose from 'mongoose';
const { Schema } = mongoose;

const analyticsSchema = new Schema({
  analyticsId: { type: String, required: true, unique: true },
  type: { type: String, required: true }, // 'task_completion', 'productivity_score', etc.
  data: { type: Schema.Types.Mixed },
  dateRange: {
    start: { type: Date },
    end: { type: Date }
  },
  owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

analyticsSchema.index({ owner: 1 });
analyticsSchema.index({ analyticsId: 1 });
export const Analytics = mongoose.model('Analytics', analyticsSchema);
