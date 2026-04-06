const mongoose = require('mongoose');

const testCaseSchema = new mongoose.Schema({
  input: { type: String, required: true },
  expectedOutput: { type: String, required: true },
  explanation: { type: String },
  isHidden: { type: Boolean, default: false },
});

const problemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Problem title is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard'],
      required: true,
    },
    description: {
      type: String,
      required: [true, 'Problem description is required'],
    },
    examples: [
      {
        input: String,
        output: String,
        explanation: String,
      },
    ],
    constraints: [String],
    testCases: [testCaseSchema],
    tags: [String],
    acceptanceRate: { type: Number, default: 0 },
    totalSubmissions: { type: Number, default: 0 },
    acceptedSubmissions: { type: Number, default: 0 },
    starterCode: {
      javascript: { type: String, default: '' },
      python: { type: String, default: '' },
      cpp: { type: String, default: '' },
      java: { type: String, default: '' },
    },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

problemSchema.pre('save', function (next) {
  if (this.totalSubmissions > 0) {
    this.acceptanceRate = Math.round(
      (this.acceptedSubmissions / this.totalSubmissions) * 100
    );
  }
  next();
});

module.exports = mongoose.model('Problem', problemSchema);
