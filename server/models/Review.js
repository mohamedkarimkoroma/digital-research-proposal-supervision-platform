const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    proposal: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Proposal',
      required: true,
    },
    supervisor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    feedback: {
      type: String,
      required: true,
      trim: true,
    },
    decision: {
      type: String,
      enum: ['Approved', 'Revisions Required', 'Rejected'],
      required: true,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: 3,
    },
  },
  { timestamps: true }
);

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;