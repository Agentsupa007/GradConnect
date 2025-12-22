import mongoose from "mongoose";

const placementOfficialSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    designation: {
      type: String,
      required: true,
      trim: true,
    },

    department: {
      type: String,
      required: true,
      trim: true,
    },

    contactNumber: {
      type: String,
      trim: true,
    },

    employeeId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    canApproveRecruiters: {
      type: Boolean,
      default: false,
    },

    canCreateJobs: {
      type: Boolean,
      default: false,
    },

    canUpdateApplicationStatus: {
      type: Boolean,
      default: false,
    },

    accessScope: {
      type: String,
      enum: ["all", "department"],
      default: "department",
    },
  },
  { timestamps: true }
);

const PlacementOfficial = mongoose.model(
  "PlacementOfficial",
  placementOfficialSchema
);

export default PlacementOfficial;


