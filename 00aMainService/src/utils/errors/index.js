const BadRequestError = require('./BadRequestError');
const NotFoundError = require('./NotFoundError');
const NotAuthorizedError = require('./NotAuthorizedError');
const RequestValidationError = require('./RequestValidationError');
const ForbiddenError = require('./ForbiddenError');

module.exports = {
  BadRequestError,
  NotFoundError,
  NotAuthorizedError,
  RequestValidationError,
  ForbiddenError,
};
