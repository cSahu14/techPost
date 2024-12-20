import mongoose from "mongoose";
import { User } from "./userInterface";

const userSchema = new mongoose.Schema<User>(
  {
    userName: {
      type: String,
      min: [3, "Must be at lease 3 letters."],
      max: [10, "Must be less than 10 letters."],
      required: [true, "Username required."],
    },
    email: {
      type: String,
      unique: true,
      validate: {
        validator: function (v) {
          return /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
            v
          );
        },
        message: (props) => `${props.value} is not a valid email!`,
      },
      required: [true, "User email required."],
    },
    isAdmin: {
      type: Boolean,
      required: [true, "User role required."],
    },
    password: {
      type: String,
      min: [8, "Must be at least 8 letters."],
      max: [20, "Must be less than 20 letters."],
     
      required: [true, "User password required."],
    },
  },
  { timestamps: true }
);

export default mongoose.model<User>("User", userSchema);
