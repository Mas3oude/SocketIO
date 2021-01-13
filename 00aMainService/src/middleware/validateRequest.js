const { validationResult } = require('express-validator');
const { RequestValidationError } = require('../utils/errors');

const validateRequest = (req, res, next) => {
  /**
   * check if there are any request validation errors
   */
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new RequestValidationError(errors.array({ onlyFirstError: true }));
  }

  /**
   * if there are no request validation errors got to the next handler
   */
  next();
};

module.exports = validateRequest;
