import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    fileUrl: {
      type: String,
      required: true,
    },
    tags: [{ type: String, trim: true }],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const internshipSchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: true,
      trim: true,
    },

    role: {
      type: String,
      required: true,
      trim: true,
    },

    duration: {
      type: String, // e.g. "3 months", "Jan–Jun 2024"
      required: true,
    },

    description: {
      type: String,
    },
  },
  { timestamps: true }
);


const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
    },

    techStack: [
      {
        type: String,
        trim: true,
      },
    ],

    projectLink: {
      type: String, // GitHub / live demo
    },
  },
  { timestamps: true }
);


const certificationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    issuedBy: {
      type: String,
      trim: true,
    },

    issueYear: {
      type: Number,
      required: true,
    },

    certificateLink: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);




const studentProfile = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
        },

        rollNumber: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },

        department: {
            type: String,
            required: true,
            trim: true,
        },

        course: {
            type: String,
            required: true,
            trim: true,
        },

        yearOfGraduation: {
            type: Number,
            required: true,
        },

        semester: {
            type: Number,
            required: true,
        },

        cgpa: {
            type: Number,
            required: true,
            min: 0,
            max: 10,
        },

        tenthPercentage: {
            type: Number,
            required: true,
            min: 0,
            max: 100,
        },

        twelfthPercentage: {
            type: Number,
            required: true,
            min: 0,
            max: 100,
        },


        backlogs: {
            type: Number,
            default: 0,
        },


        resumes : [resumeSchema],

        contactNumber: String,

        address: {
            city: String,
            state: String,
        },

        gender: {
            type: String,
            enum: ["male", "female", "other"],
        },
        
        dateOfBirth: Date,

        placementEligible: {
            type: Boolean,
            default: true,
        },

        placementConsent: {
            type: Boolean,
            default: true,
        },

        isVerified: {
            type: Boolean,
            default: false,
        },

        skills: [String],
        preferredRoles: [String],

        internships: [internshipSchema],
        projects: [projectSchema],
        certifications: [certificationSchema],


        profileCompleted: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

const Student = mongoose.model("Student", studentProfile);
export default Student;