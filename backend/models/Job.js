import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    recruiter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RecruiterProfile",
      required: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PlacementOfficial",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    jobType: {
      type: String,
      enum: ["internship", "full-time", "both"],
      required: true,
    },

    description: {
      type: String,
    },

    descriptionFiles: [
      {
        type: String, // file URLs
      },
    ],

    location: {
      city: String,
      country: String,
      remote: {
        type: Boolean,
        default: false,
      },
    },

    workMode: {
      type: String,
      enum: ["onsite", "hybrid", "remote"],
      required: true,
    },

    domain: {
      type: String,
      trim: true,
    },

    eligibility: {
      minCGPA: Number,
      maxBacklogs: Number,
      allowedDepartments: [String],
      graduationBatch: [Number],
    },

    skillsRequired: [String],

    numberOfRounds: {
      type: Number,
      required: true,
    },

    roundNames: [String],

    applicationStartDate: {
      type: Date,
      required: true,
    },

    applicationEndDate: {
      type: Date,
      required: true,
    },

    /* ===== Compensation ===== */

    ctc: {
      amount: Number, // annual CTC
      min: Number,    // for range
      max: Number,
      currency: {
        type: String,
        default: "INR",
      },
    },

    stipend: {
      amount: Number, // monthly stipend
      currency: {
        type: String,
        default: "INR",
      },
    },

    /* ===== Bond / Offer ===== */

    bond: {
      hasBond: {
        type: Boolean,
        default: false,
      },
      durationInMonths: Number,
      details: String,
    },

    offerType: {
      type: String,
      enum: ["internship", "ppo", "direct-fte"],
      required: true,
    },

    openings: {
      type: Number,
      default: 1,
    },

    status: {
      type: String,
      enum: ["draft", "open", "closed"],
      default: "draft",
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Job = mongoose.model("Job", jobSchema);

export default Job;
