const axios = require('axios');
const Submission = require('../models/Submission');
const Problem = require('../models/Problem');
const User = require('../models/User');

const JUDGE0_API_URL = process.env.JUDGE0_API_URL || 'https://judge0-ce.p.rapidapi.com';
const JUDGE0_API_KEY = process.env.JUDGE0_API_KEY || '';

const LANGUAGE_IDS = {
  javascript: 63,
  python: 71,
  cpp: 54,
  java: 62,
};

const executeCode = async (sourceCode, languageId, stdin = '') => {
  try {
    const headers = {
      'Content-Type': 'application/json',
    };

    if (JUDGE0_API_KEY) {
      headers['X-RapidAPI-Key'] = JUDGE0_API_KEY;
      headers['X-RapidAPI-Host'] = 'judge0-ce.p.rapidapi.com';
    }

    const submitRes = await axios.post(
      `${JUDGE0_API_URL}/submissions?base64_encoded=false&wait=true`,
      {
        source_code: sourceCode,
        language_id: languageId,
        stdin,
      },
      { headers, timeout: 15000 }
    );

    return submitRes.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Code execution failed');
  }
};

const VALID_LANGUAGES = Object.keys(LANGUAGE_IDS);

// Validate MongoDB ObjectId
const isValidObjectId = (id) => typeof id === 'string' && /^[0-9a-fA-F]{24}$/.test(id);

// @desc    Run code without saving submission
// @route   POST /api/submissions/run
const runCode = async (req, res) => {
  try {
    const { code, language, problemId, input } = req.body;

    if (!code || typeof code !== 'string' || !language || typeof language !== 'string') {
      return res.status(400).json({ message: 'Code and language are required' });
    }

    if (!VALID_LANGUAGES.includes(language)) {
      return res.status(400).json({ message: 'Unsupported language' });
    }

    const languageId = LANGUAGE_IDS[language];
    const safeInput = typeof input === 'string' ? input : '';
    const result = await executeCode(code, languageId, safeInput);

    res.json({
      output: result.stdout || '',
      stderr: result.stderr || '',
      compile_output: result.compile_output || '',
      status: result.status?.description || 'Unknown',
      time: result.time || '0',
      memory: result.memory || 0,
    });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Execution failed' });
  }
};

// @desc    Submit code for a problem
// @route   POST /api/submissions
const createSubmission = async (req, res) => {
  try {
    const { problemId, language, code } = req.body;

    if (!problemId || !language || !code ||
        typeof problemId !== 'string' || typeof language !== 'string' || typeof code !== 'string') {
      return res.status(400).json({ message: 'problemId, language, and code are required' });
    }

    if (!isValidObjectId(problemId)) {
      return res.status(400).json({ message: 'Invalid problem ID' });
    }

    if (!VALID_LANGUAGES.includes(language)) {
      return res.status(400).json({ message: 'Unsupported language' });
    }

    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({ message: 'Problem not found' });
    }

    const languageId = LANGUAGE_IDS[language];

    const submission = await Submission.create({
      user: req.user._id,
      problem: problemId,
      language,
      code,
      status: 'Pending',
    });


    const testResults = [];
    let allPassed = true;
    let totalTime = 0;
    let maxMemory = 0;

    const visibleTestCases = problem.testCases.filter((tc) => !tc.isHidden);

    for (let i = 0; i < visibleTestCases.length; i++) {
      const tc = visibleTestCases[i];
      try {
        const result = await executeCode(code, languageId, tc.input);
        const actualOutput = (result.stdout || '').trim();
        const expectedOutput = tc.expectedOutput.trim();
        const passed = actualOutput === expectedOutput;

        if (!passed) allPassed = false;

        if (result.time) totalTime += parseFloat(result.time);
        if (result.memory && result.memory > maxMemory) maxMemory = result.memory;

        testResults.push({
          testCase: i + 1,
          passed,
          input: tc.input,
          expectedOutput: tc.expectedOutput,
          actualOutput: result.stdout || '',
          error: result.stderr || result.compile_output || '',
        });

        if (result.status?.id === 6) {
          submission.status = 'Compilation Error';
          submission.errorMessage = result.compile_output || '';
          allPassed = false;
          break;
        }
        if (result.status?.id === 5) {
          submission.status = 'Time Limit Exceeded';
          allPassed = false;
        }
        if (result.status?.id === 11 || result.status?.id === 12) {
          submission.status = 'Runtime Error';
          allPassed = false;
        }
      } catch (err) {
        testResults.push({
          testCase: i + 1,
          passed: false,
          input: tc.input,
          expectedOutput: tc.expectedOutput,
          actualOutput: '',
          error: err.message,
        });
        allPassed = false;
      }
    }

    if (submission.status === 'Pending') {
      submission.status = allPassed ? 'Accepted' : 'Wrong Answer';
    }

    submission.testResults = testResults;
    submission.runtime = Math.round(totalTime * 1000);
    submission.memory = maxMemory;
    await submission.save();

    // Update problem stats
    await Problem.findByIdAndUpdate(problemId, {
      $inc: {
        totalSubmissions: 1,
        acceptedSubmissions: allPassed ? 1 : 0,
      },
    });

    // Update user stats if accepted
    if (allPassed) {
      const user = await User.findById(req.user._id);
      if (!user.solvedProblems.includes(problemId)) {
        user.solvedProblems.push(problemId);
        user.stats.totalSolved += 1;
        const diffKey = `${problem.difficulty.toLowerCase()}Solved`;
        user.stats[diffKey] += 1;
        await user.save({ validateBeforeSave: false });
      }
    }

    res.status(201).json(submission);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Submission failed' });
  }
};

// @desc    Get user's submissions
// @route   GET /api/submissions
const getSubmissions = async (req, res) => {
  try {
    const { problemId, page = 1, limit = 20 } = req.query;
    const filter = { user: req.user._id };

    if (problemId) {
      if (!isValidObjectId(problemId)) {
        return res.status(400).json({ message: 'Invalid problem ID' });
      }
      filter.problem = problemId;
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10) || 20));
    const skip = (pageNum - 1) * limitNum;

    const submissions = await Submission.find(filter)
      .populate('problem', 'title slug difficulty')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const total = await Submission.countDocuments(filter);

    res.json({
      submissions,
      pagination: {
        total,
        page: pageNum,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching submissions' });
  }
};

// @desc    Get single submission
// @route   GET /api/submissions/:id
const getSubmission = async (req, res) => {
  try {
    const id = req.params.id;
    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid submission ID' });
    }

    const submission = await Submission.findById(id)
      .populate('problem', 'title slug difficulty')
      .populate('user', 'username');

    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    if (submission.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(submission);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching submission' });
  }
};

module.exports = { runCode, createSubmission, getSubmissions, getSubmission };
