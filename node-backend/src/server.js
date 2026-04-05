const app = require('./app');
const { sequelize } = require('./models');

const PORT = process.env.PORT || 8000;

async function start() {
  try {
    await sequelize.authenticate();
    console.log('Database connected.');
    await sequelize.sync({ alter: true });
    console.log('Models synchronized.');
    app.listen(PORT, () => {
      console.log(`EventHub API (Node) running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

start();
