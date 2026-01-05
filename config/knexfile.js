// knexfile.js
// require("dotenv").config();
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

module.exports = {
  development: {
    client: "mysql2",
    connection: {
      host: "127.0.0.1",
      port: process.env.db_port,
      user: process.env.db_user,
      password: process.env.db_password,
      database: process.env.db_name,
    },
    migrations: {
      directory: "./migrations",
    },
    seeds: {
      directory: "./seeds",
    },
  },
};
