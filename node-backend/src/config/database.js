const { Sequelize } = require('sequelize');
const path = require('path');
require('dotenv').config();

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: process.env.DB_PATH || path.join(__dirname, '../../db.sqlite3'),
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
});

module.exports = { sequelize };
