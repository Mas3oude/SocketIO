module.exports = (err, req, res, next) => {
    const status = err.statusCode || 500;
    const message = err.message || 'Something went wrong!';
  
    if (err.serializeError) {
      return res.status(status).json({ errors: err.serializeError() });
    }
  
    const responseBody = {
      message,
    };
  
    if (process.env.NODE_ENV === 'development') {
      // log errors and send them back with the response in development mode
      console.log(err);
      responseBody.error = err.stack;
    }
  
    return res.status(status).json(responseBody);
  };
  