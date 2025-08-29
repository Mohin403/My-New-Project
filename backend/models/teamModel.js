import mongoose from 'mongoose';
const { Schema } = mongoose;

const teamSchema = new Schema({
  teamId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String },
  members: [{
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    role: { type: String, enum: ['member', 'admin'], default: 'member' }
  }],
  owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

teamSchema.index({ owner: 1 });
teamSchema.index({ teamId: 1 });
export const Team = mongoose.model('Team', teamSchema);
