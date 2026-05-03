import mongoose, { Document, Schema, CallbackWithoutResultAndOptionalError } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  avatar?: string;
  role: "user" | "recruiter" | "admin";
  accessibilityProfile: {
    disabilities: string[];
    fontSize: "normal" | "large" | "xl";
    contrast: "normal" | "high" | "dark";
    dyslexiaFont: boolean;
    voiceNavigation: boolean;
    reducedMotion: boolean;
    signLanguage: boolean;
    subtitles: boolean;
  };
  isActive: boolean;
  createdAt: Date;
  comparePassword(password: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6, select: false },
    avatar: String,
    role: { type: String, enum: ["user", "recruiter", "admin"], default: "user" },
    accessibilityProfile: {
      disabilities: { type: [String], default: [] },
      fontSize: { type: String, enum: ["normal", "large", "xl"], default: "normal" },
      contrast: { type: String, enum: ["normal", "high", "dark"], default: "normal" },
      dyslexiaFont: { type: Boolean, default: false },
      voiceNavigation: { type: Boolean, default: false },
      reducedMotion: { type: Boolean, default: false },
      signLanguage: { type: Boolean, default: false },
      subtitles: { type: Boolean, default: false },
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
UserSchema.pre("validate", async function (this: any, next: any) {
  if (!this.isModified("password")) { next(); return; }
  this.password = await bcrypt.hash(this.password as string, 12);
  next();
});

UserSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

export default mongoose.model<IUser>("User", UserSchema);
