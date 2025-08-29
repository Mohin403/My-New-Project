import mongoose from 'mongoose';
const { Schema } = mongoose;

const fileSchema = new Schema({
  fileId: { type: String, required: true, unique: true },
  filename: { type: String, required: true },
  originalName: { type: String, required: true },
  mimeType: { type: String, required: true },
  size: { type: Number, required: true },
  url: { type: String, required: true },
  relatedTo: {
    type: { type: String, enum: ['task', 'note', 'user'] },
    id: { type: Schema.Types.ObjectId }
  },
  owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

fileSchema.index({ owner: 1 });
fileSchema.index({ fileId: 1 });
export const File = mongoose.model('File', fileSchema);