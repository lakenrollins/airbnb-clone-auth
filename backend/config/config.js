


/*
// backend/config/config.js
require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: 'sqlite',  // Or 'postgres' for production
    storage: './db/development.sqlite3',  // SQLite specific setting
    seederStorage: 'sequelize',
  },
  production: {
    use_env_variable: 'DATABASE_URL',
    dialect: 'postgres',
    seederStorage: 'sequelize',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  },
  test: {
    dialect: 'sqlite',
    storage: './db/test.sqlite3',
    seederStorage: 'sequelize',
  }
};
*/
