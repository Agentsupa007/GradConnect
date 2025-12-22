import mongoose from "mongoose";

/* ===== Round Subdocument ===== */
const roundSchema = new mongoose.Schema(
  {
    roundNumber: {
      type: Number,
      required: true,
    },

    roundName: {
      type: String,
      trim: true,
    },

    status: {
      type: String,
      enum: ["pending", "cleared", "failed"],
      default: "pending",
    },

    date: {
      type: Date,
    },

    remarks: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

/* ===== Application Schema ===== */
const applicationSchema = new mongoose.Schema(
  {
    /* ===== Core References ===== */

    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StudentProfile",
      required: true,
    },

    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },

    recruiter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RecruiterProfile",
      required: true,
    },

    lastUpdatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PlacementOfficial",
    },

    /* ===== Resume Usage ===== */

    resume: {
      resumeId: {
        type: mongoose.Schema.Types.ObjectId, // subdocument _id
      },
      resumeName: {
        type: String,
        trim: true,
      },
      resumeUrl: {
        type: String,
      },
    },

    /* ===== Application Status ===== */

    status: {
      type: String,
      enum: ["applied", "shortlisted", "rejected", "selected", "withdrawn"],
      default: "applied",
    },

    currentRoundNumber: {
      type: Number,
      default: 0,
    },

    currentRoundName: {
      type: String,
      trim: true,
    },

    /* ===== Round Tracking ===== */

    rounds: [roundSchema],

    /* ===== Timeline & Metadata ===== */

    appliedAt: {
      type: Date,
      default: Date.now,
    },

    statusUpdatedAt: {
      type: Date,
    },

    /* ===== Controls ===== */

    isActive: {
      type: Boolean,
      default: true,
    },

    isWithdrawnByStudent: {
      type: Boolean,
      default: false,
    },

  },
  { timestamps: true }
);

const Application = mongoose.model("Application", applicationSchema);

export default Application;
