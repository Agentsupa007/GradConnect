import StudentProfile from '../models/StudentProfile.js';

// GET /api/search/students?skills=React,Node.js&page=1&limit=20
export const searchStudents = async (req, res) => {
  try {
    const { skills, page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    let pipeline = [];

    if (skills && skills.trim()) {
      const skillList = skills.split(',').map(s => s.trim()).filter(Boolean);

      pipeline = [
        {
          $addFields: {
            matchCount: {
              $size: {
                $setIntersection: ['$skills', skillList],
              },
            },
          },
        },
        { $match: { matchCount: { $gt: 0 } } },
        { $sort: { matchCount: -1 } },
      ];
    } else {
      pipeline = [{ $addFields: { matchCount: 0 } }, { $sort: { createdAt: -1 } }];
    }

    // Count total matching
    const countPipeline = [...pipeline, { $count: 'total' }];
    const countResult = await StudentProfile.aggregate(countPipeline);
    const total = countResult[0]?.total || 0;

    // Add pagination + populate user
    pipeline.push({ $skip: skip }, { $limit: parseInt(limit) });

    pipeline.push({
      $lookup: {
        from: 'users',
        localField: 'user',
        foreignField: '_id',
        as: 'user',
      },
    });
    pipeline.push({ $unwind: '$user' });
    pipeline.push({
      $project: {
        'user.password': 0,
        'user.refreshToken': 0,
      },
    });

    const students = await StudentProfile.aggregate(pipeline);

    // Only expose active resume to non-student viewers
    const sanitized = students.map(s => ({
      ...s,
      resumes: s.resumes.filter(r => r.isActive),
    }));

    res.json({
      students: sanitized,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
