import mongoose from 'mongoose';

const historyEntrySchema = new mongoose.Schema({
  action: { type: String }, // 'applied' | 'advanced' | 'selected' | 'rejected'
  roundName: { type: String, default: '' },
  note: { type: String, default: '' },
  at: { type: Date, default: Date.now },
}, { _id: false });

const applicationSchema = new mongoose.Schema({
  job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'StudentProfile', required: true },
  // 'applied' = submitted, not yet called for any round
  // 'in_progress' = currently in one of the rounds
  // 'selected' = offer made
  // 'rejected' = eliminated
  status: {
    type: String,
    enum: ['applied', 'in_progress', 'selected', 'rejected'],
    default: 'applied',
  },
  // -1 = not in any round yet, 0 = in round[0], 1 = in round[1], ...
  currentRound: { type: Number, default: -1 },
  history: [historyEntrySchema],
}, { timestamps: true });

applicationSchema.index({ job: 1, student: 1 }, { unique: true });

export default mongoose.model('Application', applicationSchema);
