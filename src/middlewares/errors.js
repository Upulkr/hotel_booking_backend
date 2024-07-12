// errorMiddleware.js
export const errorMiddleware = (error, req, res, next) => {
  res.status(error.statusCode || 400).json({
    message: error.message || "Internal Server Error",
    errorCode: error.errorCode || "INTERNAL_SERVER_ERROR",
    errors: error.errors 
  });
};
