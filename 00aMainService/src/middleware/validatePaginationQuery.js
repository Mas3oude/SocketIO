const { query } = require('express-validator');

const validatePaginationQueryString = [
  query('offset')
    .optional()
    .isInt({ min: 0 })
    .withMessage('offset should be a number from 0 and above'),
  query('limit')
    .optional()
    .isInt({ min: 0, max: 20 })
    .withMessage('limit should be a number between 0 and 20'),
  query('seen')
   .optional()
   .isBoolean()
   .withMessage('seen should be in query and the value should be true or false')
];

module.exports = validatePaginationQueryString;
