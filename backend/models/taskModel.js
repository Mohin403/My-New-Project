import mongoose from "mongoose";
const { Schema } = mongoose;

const taskSchema = new Schema(
  {
    taskId: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String },
    status: {
      type: String,
      enum: ["pending", "in-progress", "completed"],
      default: "pending",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    startDate: { type: Date },
    endDate: { type: Date },
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
    teamId: { type: Schema.Types.ObjectId, ref: "Team" },
    sharedWith: [{ type: Schema.Types.ObjectId, ref: "User" }],
    attachments: [{ type: String }],
  },
  { timestamps: true }
);

taskSchema.index({ owner: 1, status: 1 });
taskSchema.index({ taskId: 1 });
export const Task = mongoose.model("Task", taskSchema);
