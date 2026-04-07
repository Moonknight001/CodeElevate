const User = require('../models/User');
const Submission = require('../models/Submission');

// @desc    Get user profile
// @route   GET /api/user/profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('solvedProblems', 'title slug difficulty');

    res.json({
      id: user._id,
      username: user.username,
      email: user.email,
      stats: user.stats,
      solvedProblems: user.solvedProblems,
      createdAt: user.createdAt,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile' });
  }
};

// @desc    Get user stats
// @route   GET /api/user/stats
const getStats = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    const recentSubmissions = await Submission.find({ user: req.user._id })
      .populate('problem', 'title slug difficulty')
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      stats: user.stats,
      recentSubmissions,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching stats' });
  }
};

module.exports = { getProfile, getStats };
