function NotAuthorizedError(message) {
  this.name = 'NotAuthorizedError';
  this.message = message;
  this.statusCode = 401;
}
NotAuthorizedError.prototype = Error.prototype;

module.exports = NotAuthorizedError;
