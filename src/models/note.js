import mongoose, { Schema } from "mongoose";

const noteSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    tag: {
      type: String,
      enum: ["Todo", "Travel", "Work", "Personal", "Meeting", "Shopping", "Health", "Finance", "Ideas", "Important"],
      default: "Todo",
    }
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const Note = mongoose.model("Note", noteSchema);
