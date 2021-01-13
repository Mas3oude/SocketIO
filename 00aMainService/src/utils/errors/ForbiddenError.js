function ForbiddenError(message) {
  this.name = 'ForbiddenError';
  this.message = message;
  this.statusCode = 403;
  this.serializeError = () => {
    return [{ message: this.message }];
  };
}

ForbiddenError.prototype = Error.prototype;

module.exports = ForbiddenError;
