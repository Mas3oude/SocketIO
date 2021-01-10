const http = require('http');
const app = require('./app');
const socket = require('./src/socketioManager/socket');
/**
 * @constant PORT the server listens to
 */
const PORT = process.env.PORT || '3002';

/**
 * Create HTTP server.
 */
const server = http.createServer(app);

server.listen(PORT);

// When Server starts listening
server.on('listening', async () => {
  console.log(`the server is running at http://127.0.0.1:${PORT}`);
});

// When the server is closed
server.on('close', () => {
  process.exit(0);
});

socket.initSocket(server);
