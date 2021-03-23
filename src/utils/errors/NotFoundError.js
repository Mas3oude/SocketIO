function NotFoundError(message) {
  this.name = 'NotFoundError';
  this.message = message;
  this.statusCode = 404;
}
NotFoundError.prototype = Error.prototype;

module.exports = NotFoundError;
