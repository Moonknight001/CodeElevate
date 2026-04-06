const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    problem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Problem',
      required: true,
    },
    language: {
      type: String,
      enum: ['javascript', 'python', 'cpp', 'java'],
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['Accepted', 'Wrong Answer', 'Time Limit Exceeded', 'Runtime Error', 'Compilation Error', 'Pending'],
      default: 'Pending',
    },
    runtime: { type: Number, default: 0 },
    memory: { type: Number, default: 0 },
    testResults: [
      {
        testCase: Number,
        passed: Boolean,
        input: String,
        expectedOutput: String,
        actualOutput: String,
        error: String,
      },
    ],
    output: { type: String, default: '' },
    errorMessage: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Submission', submissionSchema);
