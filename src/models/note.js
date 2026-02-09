import mongoose, { Schema } from "mongoose";
import { TAGS } from "../constants/tags.js";
import { User } from "./user.js";

const noteSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      default: "",
      trim: true,
    },
    tag: {
      type: String,
      enum: TAGS,
      default: "Todo",
    },
    userId: {
      type: mongoose.Types.ObjectId,
      ref: User,
      required: true,
    }
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

noteSchema.index({
  title: "text",
  content: "text"
});

noteSchema.index({
  tag: 1
});

export const Note = mongoose.model("Note", noteSchema);
