const recruiterOnly = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Authentication required.",
    });
  }

  if (req.user.role !== "recruiter") {
    return res.status(403).json({
      success: false,
      message: "Only recruiters can perform this action.",
    });
  }

  next();
};

module.exports = {
  recruiterOnly,
};