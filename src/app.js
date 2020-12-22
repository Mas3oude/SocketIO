require('dotenv').config();
/**
 *
 */
//npm modules require
const path = require('path');
const express = require('express');
const morgan = require('morgan');


//internal require
const { NotFoundError } = require('./utils/errors');

const apiRouter = require('./router');
const errorHandler = require('./middleware/errorHandler');
/**
 * @constant App is the starting of the application
 */
const app = express();

/**
 * add middleware
 */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

//add morgan as middle ware
app.use(morgan('combined'));

app.use('/api/v1', apiRouter);

/**
 * handling 404 not found paths
 */
app.all('*', async (req, res, next) => {
  const err = new NotFoundError(
    `${req.originalUrl} does not exist on the server`
  );
  next(err);
});

/**
 * handling all errors
 */
app.use(errorHandler);

module.exports = app;
