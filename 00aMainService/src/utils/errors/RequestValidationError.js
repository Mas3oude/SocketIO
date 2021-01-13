/**
 * a request validation error
 * @param {Array{Object}} errorsArr
 */
function RequestValidationError(errorsArr) {
  this.name = 'RequestValidationError';
  this.errorsArr = errorsArr;
  this.statusCode = 400;
  this.serializeError = () => {
    return this.errorsArr.map((error) => {
      return { message: error.msg, field: error.param };
    });
  };
}

RequestValidationError.prototype = Error.prototype;

module.exports = RequestValidationError;
