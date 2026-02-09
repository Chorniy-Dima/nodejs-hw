import mongoose, { Schema } from "mongoose";
import { User } from "./user.js";

const sessionSchema = new Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    ref: User,
  },
  accessToken: {
    type: String,
    required: true,
  },
  refreshToken: {
    type: String,
    required: true,
  },
  accessTokenValidUntil: {
    type: Date,
    required: true,
  },
  refreshTokenValidUntil: {
    type: Date,
    rrequired: true,
  }
}, {
  timestamps: true,
  versionKey: false,
});

export const Session = mongoose.model("Session", sessionSchema);
