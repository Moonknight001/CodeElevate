const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  runCode,
  createSubmission,
  getSubmissions,
  getSubmission,
} = require('../controllers/submissionController');

router.post('/run', protect, runCode);
router.post('/', protect, createSubmission);
router.get('/', protect, getSubmissions);
router.get('/:id', protect, getSubmission);

module.exports = router;
