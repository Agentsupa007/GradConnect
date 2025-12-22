import mongoose from "mongoose";

const recruiterContactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    contactNumber: {
      type: String,
      trim: true,
    },

    designation: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);


const recruiterProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    companyName: {
      type: String,
      required: true,
      trim: true,
    },

    companyDescription: {
      type: String,
      trim: true,
    },

    industry: {
      type: String,
      trim: true,
    },

    companyWebsite: {
      type: String,
      trim: true,
    },

    companyLocation: {
      city: String,
      country: String,
    },

    jobLocation: {
      type: String,
      trim: true,
    },

    recruiterContacts: [recruiterContactSchema],

    jobDescriptionFiles: [
      {
        type: String, // file URLs
      },
    ],

    internshipRolesOffered: {
      type: Boolean,
      default: false,
    },

    fullTimeRolesOffered: {
      type: Boolean,
      default: false,
    },

    approvalStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PlacementOfficial",
    },

    approvalDate: {
      type: Date,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const RecruiterProfile = mongoose.model(
  "RecruiterProfile",
  recruiterProfileSchema
);

export default RecruiterProfile;
