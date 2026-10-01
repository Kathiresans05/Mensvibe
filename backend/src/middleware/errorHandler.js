const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message || 'Internal Server Error';

  if (err.name === 'MongooseError' && err.message.includes('buffering timed out')) {
    statusCode = 503;
    message = 'Database offline: MongoDB is not connected. Please start local MongoDB or provide a MongoDB Atlas URI in backend/.env';
  }

  console.error(`[Error] ${req.method} ${req.originalUrl}:`, err.message);

  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

module.exports = errorHandler;

