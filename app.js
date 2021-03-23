require('dotenv').config();
const path = require('path');
const express = require('express');
var morgan = require('morgan');
var cors = require('cors');
const favicon = require('serve-favicon');
const apiRouter = require('./src/router');
const errorHandler = require('./src/middleware/errorHandler');
/**
 * @constant App is the starting of the application
 */
const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(favicon(path.join(__dirname, 'public', 'notificationIcon.png')));
app.use(express.static(__dirname+'/public'));
app.use(morgan('combined'));
app.options('*', cors());
app.use('/api/v1', apiRouter);
// app.get('/', function(request, response) {
// 	response.sendFile(path.join(__dirname + '/public/login.html'));
// });

/**
 * handling 404 not found paths
 */
app.all('*', async (req, res, next) => {
    const err = //new NotFoundError(
      `${req.originalUrl} does not exist on the server`;
   // );
    next(err);
  });
  
  /**
   * handling all errors
   */
  app.use(errorHandler);
  
  // init sockets
  
  module.exports = app;