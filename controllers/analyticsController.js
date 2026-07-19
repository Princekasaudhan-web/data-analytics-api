const Post = require("../models/Post");


const postsPerCategory = async (req, res) => {
  try {
    const result = await Post.aggregate([
      {
        $group: {
          _id: "$category",
          totalPosts: {
            $sum: 1,
          },
        },
      },
      {
        $sort: {
          totalPosts: -1,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const totalViewsPerCategory = async (req, res) => {
  try {
    const result = await Post.aggregate([
      {
        $group: {
          _id: "$category",
          totalViews: {
            $sum: "$views",
          },
        },
      },
      {
        $sort: {
          totalViews: -1,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


const averageViewsPerCategory = async (req, res) => {
  try {
    const result = await Post.aggregate([
      {
        $group: {
          _id: "$category",
          averageViews: {
            $avg: "$views",
          },
        },
      },
      {
        $sort: {
          averageViews: -1,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


const topViewedPosts = async (req, res) => {
  try {
    const result = await Post.aggregate([
      {
        $sort: {
          views: -1,
        },
      },
      {
        $limit: 5,
      },
    ]);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


const postsPerMonth = async (req, res) => {
  try {
    const result = await Post.aggregate([
      {
        $group: {
          _id: {
            $month: "$createdAt",
          },
          totalPosts: {
            $sum: 1,
          },
        },
      },
      {
        $sort: {
          _id: 1,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


const analyticsByUser = async (req, res) => {
  try {
    const { user } = req.params;

    const result = await Post.aggregate([
      {
        $match: {
          user: user,
        },
      },
      {
        $group: {
          _id: "$category",
          totalPosts: {
            $sum: 1,
          },
          totalViews: {
            $sum: "$views",
          },
          totalLikes: {
            $sum: "$likes",
          },
        },
      },
      {
        $sort: {
          totalPosts: -1,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      user,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const analyticsByDateRange = async (req, res) => {
  try {
    const { start, end } = req.query;

    const matchStage = {};

    if (start && end) {
      matchStage.createdAt = {
        $gte: new Date(start),
        $lte: new Date(end),
      };
    }

    const result = await Post.aggregate([
      {
        $match: matchStage,
      },
      {
        $group: {
          _id: "$category",
          totalPosts: {
            $sum: 1,
          },
          totalViews: {
            $sum: "$views",
          },
          totalLikes: {
            $sum: "$likes",
          },
        },
      },
      {
        $sort: {
          totalPosts: -1,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      filters: {
        start,
        end,
      },
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const analyticsWithProject = async (req, res) => {
  try {
    const result = await Post.aggregate([
      {
        $group: {
          _id: "$category",
          totalPosts: {
            $sum: 1,
          },
          totalViews: {
            $sum: "$views",
          },
          totalLikes: {
            $sum: "$likes",
          },
        },
      },
      {
        $project: {
          _id: 0,
          category: "$_id",
          posts: "$totalPosts",
          views: "$totalViews",
          likes: "$totalLikes",
        },
      },
      {
        $sort: {
          posts: -1,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const dashboardAnalytics = async (req, res) => {
  try {
    
    const overall = await Post.aggregate([
      {
        $group: {
          _id: null,
          totalPosts: { $sum: 1 },
          totalViews: { $sum: "$views" },
          totalLikes: { $sum: "$likes" },
          averageViews: { $avg: "$views" },
        },
      },
    ]);

    // Posts per category
    const categories = await Post.aggregate([
      {
        $group: {
          _id: "$category",
          posts: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          category: "$_id",
          posts: 1,
        },
      },
      {
        $sort: {
          posts: -1,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      dashboard: {
        totalPosts: overall[0]?.totalPosts || 0,
        totalViews: overall[0]?.totalViews || 0,
        totalLikes: overall[0]?.totalLikes || 0,
        averageViews: Math.round(overall[0]?.averageViews || 0),
        categories,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  postsPerCategory,
  totalViewsPerCategory,
  averageViewsPerCategory,
    topViewedPosts,
      postsPerMonth,
       analyticsByUser,
       analyticsByDateRange,
         analyticsWithProject,
         dashboardAnalytics,
};