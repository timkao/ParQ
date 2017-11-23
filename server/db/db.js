const Sequelize = require('sequelize')
const db = new Sequelize(
  process.env.DATABASE_URL || 'postgres://localhost:5432/parq', {
    logging: false,
    pool: {
      idle: 150000,
      acquire: 150000
    }
  }
)
module.exports = db
