const Problem = require('../models/Problem');

// @desc    Get all problems (with optional difficulty filter)
// @route   GET /api/problems
const getProblems = async (req, res) => {
  try {
    const { difficulty, tag, search, page = 1, limit = 50 } = req.query;
    const filter = {};

    if (difficulty && ['Easy', 'Medium', 'Hard'].includes(difficulty)) {
      filter.difficulty = difficulty;
    }
    if (tag) {
      filter.tags = { $in: [tag] };
    }
    if (search) {
      filter.title = { $regex: search, $options: 'i' };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const problems = await Problem.find(filter)
      .select('-testCases -description -starterCode')
      .sort({ order: 1, createdAt: 1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Problem.countDocuments(filter);

    res.json({
      problems,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
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
    const { id } = req.params;
    const query = id.match(/^[0-9a-fA-F]{24}$/)
      ? { _id: id }
      : { slug: id };

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
