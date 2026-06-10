require('dotenv').config();

const config = {
  development: {
    use_env_variable: 'DATABASE_URL',
    dialect: 'mysql',
    define: { timestamps: true, underscored: false, freezeTableName: true }
  },
  test: {
    use_env_variable: 'DATABASE_URL',
    dialect: 'mysql'
  },
  production: {
    use_env_variable: 'DATABASE_URL',
    dialect: 'mysql',
    define: { timestamps: true, underscored: false, freezeTableName: true }
  }
};

module.exports = config;
