function BadRequestError(message) {
  this.name = 'BadRequestError';
  this.message = message;
  this.statusCode = 400;
}
BadRequestError.prototype = Error.prototype;

module.exports = BadRequestError;
