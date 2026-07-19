const express = require("express");
const router = express.Router();

const {
  postsPerCategory,
  totalViewsPerCategory,
averageViewsPerCategory,
  topViewedPosts,
    postsPerMonth,
      analyticsByUser,
       analyticsByDateRange,
        analyticsWithProject,
          dashboardAnalytics,
} = require("../controllers/analyticsController");


router.get("/category", postsPerCategory);
router.get("/views", totalViewsPerCategory);
router.get("/average", averageViewsPerCategory);
router.get("/top", topViewedPosts);
router.get("/month", postsPerMonth);
router.get("/user/:user", analyticsByUser);
router.get("/date", analyticsByDateRange);
router.get("/project", analyticsWithProject);
router.get("/dashboard", dashboardAnalytics);

module.exports = router;