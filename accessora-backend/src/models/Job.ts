import mongoose, { Document, Schema } from "mongoose";

export interface IJob extends Document {
  title: string;
  company: string;
  companyLogo?: string;
  location: string;
  type: "full-time" | "part-time" | "remote" | "contract";
  salary?: string;
  description: string;
  requirements: string[];
  accessibilityScore: number;
  disabilityFriendly: boolean;
  accommodations: string[];
  recruiter: mongoose.Types.ObjectId;
  tags: string[];
  isActive: boolean;
  applications: number;
  createdAt: Date;
}

const JobSchema = new Schema<IJob>(
  {
    title: { type: String, required: true, trim: true },
    company: { type: String, required: true },
    companyLogo: String,
    location: { type: String, required: true },
    type: { type: String, enum: ["full-time", "part-time", "remote", "contract"], required: true },
    salary: String,
    description: { type: String, required: true },
    requirements: [String],
    accessibilityScore: { type: Number, min: 0, max: 100, default: 70 },
    disabilityFriendly: { type: Boolean, default: false },
    accommodations: [String],
    recruiter: { type: Schema.Types.ObjectId, ref: "User" },
    tags: [String],
    isActive: { type: Boolean, default: true },
    applications: { type: Number, default: 0 },
  },
  { timestamps: true }
);

JobSchema.index({ title: "text", company: "text", description: "text" });
JobSchema.index({ location: 1, type: 1, disabilityFriendly: 1 });

export default mongoose.model<IJob>("Job", JobSchema);
