import { Schema, model } from "mongoose";
import { mongoSaveError, setMongoUpdateSettings } from "./hooks.js";
import { emailRegexp } from "../../constants/user-constants.js";

const userSchema = new Schema(
  {
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      match: emailRegexp,
    },
    subscription: {
      type: String,
      enum: ["starter", "pro", "business"],
      default: "starter",
    },
    token: {
      type: String,
      default: null,
    },
    verify: {
      type: Boolean,
      default: false,
      required: true,
    },
    verificationCode: {
      type: String,
    },
    avatarURL: String,
  },
  { versionKey: false, timestamps: true }
);
userSchema.post("save", mongoSaveError);
userSchema.pre("findOneAndUpdate", setMongoUpdateSettings);
userSchema.post("findOneAndUpdate", mongoSaveError);
export const User = model("user", userSchema);
