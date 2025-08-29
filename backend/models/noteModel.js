import mongoose from 'mongoose';
const { Schema } = mongoose;

const noteSchema = new Schema({
  noteId: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  tags: [{ type: String }],
  category: { type: String, default: 'general' },
  owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

noteSchema.index({ owner: 1, tags: 1 });
noteSchema.index({ noteId: 1 });
export const Note = mongoose.model('Note', noteSchema);