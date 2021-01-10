require('dotenv').config();

module.exports = {
    development: {
      connectionString: process.env.DEV_DOCKER_MONGO_URL,
    },
    test: {
      connectionString: process.env.TEST_DOCKER_MONGO_URL,
    },
    production: {
      connectionString: process.env.PRODUCT_DOCKER_MONGO_URL,
    },
  };
