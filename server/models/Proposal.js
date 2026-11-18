const mongoose = require('mongoose');

const proposalSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    supervisor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    abstract: {
      type: String,
      required: true,
    },
    keywords: {
      type: [String],
      default: [],
    },
    documentPath: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: [
        'Draft',
        'Submitted',
        'Under Review',
        'Revisions Required',
        'Approved',
        'Rejected',
      ],
      default: 'Draft',
    },
    currentVersion: {
      type: Number,
      default: 1,
    },
  },
  { timestamps: true }
);

const Proposal = mongoose.model('Proposal', proposalSchema);

module.exports = Proposal;