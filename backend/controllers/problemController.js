const Problem = require('../models/Problem');

// Escape regex special characters to prevent regex injection
const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Sanitize a string input (ensure it is a string, not an object)
const sanitizeString = (val) => (typeof val === 'string' ? val.trim() : '');

// @desc    Get all problems (with optional difficulty filter)
// @route   GET /api/problems
const getProblems = async (req, res) => {
  try {
    const { difficulty, tag, search, page = 1, limit = 50 } = req.query;
    const filter = {};

    const difficultyStr = sanitizeString(difficulty);
    if (difficultyStr && ['Easy', 'Medium', 'Hard'].includes(difficultyStr)) {
      filter.difficulty = difficultyStr;
    }

    const tagStr = sanitizeString(tag);
    if (tagStr) {
      filter.tags = { $in: [tagStr] };
    }

    const searchStr = sanitizeString(search);
    if (searchStr) {
      filter.title = { $regex: escapeRegex(searchStr), $options: 'i' };
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 50));
    const skip = (pageNum - 1) * limitNum;

    const problems = await Problem.find(filter)
      .select('-testCases -description -starterCode')
      .sort({ order: 1, createdAt: 1 })
      .skip(skip)
      .limit(limitNum);

    const total = await Problem.countDocuments(filter);

    res.json({
      problems,
      pagination: {
        total,
        page: pageNum,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching problems' });
  }
};

// @desc    Get single problem by id or slug
// @route   GET /api/problems/:id
const getProblem = async (req, res) => {
  try {
    const id = sanitizeString(req.params.id);
    if (!id) {
      return res.status(400).json({ message: 'Problem ID is required' });
    }
    const query = /^[0-9a-fA-F]{24}$/.test(id) ? { _id: id } : { slug: id };


    const problem = await Problem.findOne(query).select('-testCases');
    if (!problem) {
      return res.status(404).json({ message: 'Problem not found' });
    }
    res.json(problem);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching problem' });
  }
};

module.exports = { getProblems, getProblem };
