const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Project = require('../models/Project');
const auth = require('../middleware/auth');

const router = express.Router();

// Apply auth middleware to all routes
router.use(auth);

// @route   GET /api/projects
// @desc    Get all projects for the authenticated user with filtering, pagination, and date range
// @access  Private
router.get('/', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('status').optional().isIn(['current', 'completed']).withMessage('Status must be current or completed'),
  query('priority').optional().isIn(['Easy', 'Medium', 'Hard']).withMessage('Priority must be Easy, Medium, or Hard'),
  query('from').optional().isISO8601().withMessage('From date must be a valid ISO date'),
  query('to').optional().isISO8601().withMessage('To date must be a valid ISO date'),
  query('search').optional().isString().withMessage('Search must be a string'),
  query('sortBy').optional().isIn(['title', 'priority', 'status', 'deadline', 'createdAt']).withMessage('Invalid sort field'),
  query('sortOrder').optional().isIn(['asc', 'desc']).withMessage('Sort order must be asc or desc')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array()
      });
    }

    const {
      page = 1,
      limit = 10,
      status,
      priority,
      from,
      to,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter object
    const filter = { user: req.user._id };

    if (status) filter.status = status;
    if (priority) filter.priority = priority;

    // Date range filtering
    if (from || to) {
      filter.deadline = {};
      if (from) filter.deadline.$gte = from;
      if (to) filter.deadline.$lte = to;
    }

    // Search functionality
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute query with pagination
    const projects = await Project.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count for pagination
    const total = await Project.countDocuments(filter);

    // Calculate pagination info
    const totalPages = Math.ceil(total / parseInt(limit));
    const hasNextPage = parseInt(page) < totalPages;
    const hasPrevPage = parseInt(page) > 1;

    res.json({
      success: true,
      data: projects,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalItems: total,
        itemsPerPage: parseInt(limit),
        hasNextPage,
        hasPrevPage
      },
      filters: {
        status,
        priority,
        from,
        to,
        search,
        sortBy,
        sortOrder
      }
    });
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching projects'
    });
  }
});

// @route   GET /api/projects/:id
// @desc    Get a specific project by ID
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    res.json({
      success: true,
      data: project
    });
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching project'
    });
  }
});

// @route   POST /api/projects
// @desc    Create a new project
// @access  Private
router.post('/', [
  body('title')
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 100 })
    .withMessage('Title cannot exceed 100 characters'),
  body('description')
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
  body('priority')
    .isIn(['Easy', 'Medium', 'Hard'])
    .withMessage('Priority must be Easy, Medium, or Hard'),
  body('status')
    .isIn(['current', 'completed'])
    .withMessage('Status must be current or completed'),
  body('start')
    .isISO8601()
    .withMessage('Start date must be a valid date'),
  body('starttime')
    .notEmpty()
    .withMessage('Start time is required'),
  body('end')
    .isISO8601()
    .withMessage('End date must be a valid date'),
  body('endtime')
    .notEmpty()
    .withMessage('End time is required'),
  body('deadline')
    .matches(/^\d{4}-\d{2}-\d{2}$/)
    .withMessage('Deadline must be in YYYY-MM-DD format')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array()
      });
    }

    const {
      title,
      description,
      priority,
      status,
      start,
      starttime,
      end,
      endtime,
      deadline
    } = req.body;

    const project = new Project({
      title,
      description,
      priority,
      status,
      start,
      starttime,
      end,
      endtime,
      deadline,
      user: req.user._id
    });

    await project.save();

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: project
    });

  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating project'
    });
  }
});

// @route   PUT /api/projects/:id
// @desc    Update a project
// @access  Private
router.put('/:id', [
  body('title')
    .optional()
    .notEmpty()
    .withMessage('Title cannot be empty')
    .isLength({ max: 100 })
    .withMessage('Title cannot exceed 100 characters'),
  body('description')
    .optional()
    .notEmpty()
    .withMessage('Description cannot be empty')
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
  body('priority')
    .optional()
    .isIn(['Easy', 'Medium', 'Hard'])
    .withMessage('Priority must be Easy, Medium, or Hard'),
  body('status')
    .optional()
    .isIn(['current', 'completed'])
    .withMessage('Status must be current or completed'),
  body('start')
    .optional()
    .isISO8601()
    .withMessage('Start date must be a valid date'),
  body('starttime')
    .optional()
    .notEmpty()
    .withMessage('Start time cannot be empty'),
  body('end')
    .optional()
    .isISO8601()
    .withMessage('End date must be a valid date'),
  body('endtime')
    .optional()
    .notEmpty()
    .withMessage('End time cannot be empty'),
  body('deadline')
    .optional()
    .matches(/^\d{4}-\d{2}-\d{2}$/)
    .withMessage('Deadline must be in YYYY-MM-DD format')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array()
      });
    }

    const project = await Project.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Update fields
    Object.keys(req.body).forEach(key => {
      if (req.body[key] !== undefined) {
        project[key] = req.body[key];
      }
    });

    await project.save();

    res.json({
      success: true,
      message: 'Project updated successfully',
      data: project
    });

  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating project'
    });
  }
});

// @route   DELETE /api/projects/:id
// @desc    Delete a project
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const project = await Project.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    res.json({
      success: true,
      message: 'Project deleted successfully'
    });

  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting project'
    });
  }
});

// @route   GET /api/projects/status/:status
// @desc    Get projects by status
// @access  Private
router.get('/status/:status', async (req, res) => {
  try {
    const { status } = req.params;
    
    if (!['current', 'completed'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status must be current or completed'
      });
    }

    const projects = await Project.find({
      user: req.user._id,
      status: status
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: projects.length,
      data: projects
    });

  } catch (error) {
    console.error('Get projects by status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching projects'
    });
  }
});

// @route   GET /api/projects/priority/:priority
// @desc    Get projects by priority
// @access  Private
router.get('/priority/:priority', async (req, res) => {
  try {
    const { priority } = req.params;
    
    if (!['Easy', 'Medium', 'Hard'].includes(priority)) {
      return res.status(400).json({
        success: false,
        message: 'Priority must be Easy, Medium, or Hard'
      });
    }

    const projects = await Project.find({
      user: req.user._id,
      priority: priority
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: projects.length,
      data: projects
    });

  } catch (error) {
    console.error('Get projects by priority error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching projects'
    });
  }
});

// @route   GET /api/projects/stats/summary
// @desc    Get project statistics summary
// @access  Private
router.get('/stats/summary', async (req, res) => {
  try {
    const stats = await Project.aggregate([
      { $match: { user: req.user._id } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          current: { $sum: { $cond: [{ $eq: ['$status', 'current'] }, 1, 0] } },
          completed: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } },
          easy: { $sum: { $cond: [{ $eq: ['$priority', 'Easy'] }, 1, 0] } },
          medium: { $sum: { $cond: [{ $eq: ['$priority', 'Medium'] }, 1, 0] } },
          hard: { $sum: { $cond: [{ $eq: ['$priority', 'Hard'] }, 1, 0] } }
        }
      }
    ]);

    const summary = stats[0] || {
      total: 0,
      current: 0,
      completed: 0,
      easy: 0,
      medium: 0,
      hard: 0
    };

    res.json({
      success: true,
      data: summary
    });

  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching statistics'
    });
  }
});

module.exports = router; 