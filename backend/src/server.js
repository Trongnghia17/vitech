require('dotenv').config();

const app = require('./app');
const { sequelize } = require('./models');
const logger = require('./config/logger');
const authService = require('./services/authService');

const PORT = parseInt(process.env.PORT, 10) || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

const startServer = async () => {
  try {
    await sequelize.authenticate();
    logger.info('✅ Database connection established successfully.');

    if (NODE_ENV === 'development') {
      await sequelize.sync({ alter: true });
      logger.info('✅ Database models synchronized.');

      // Tạo tài khoản admin mặc định nếu chưa có
      try {
        await authService.createAdmin({
          name: 'Super Admin',
          email: 'admin@vitechs.com',
          password: 'Admin@123456',
          role: 'superadmin',
        });
        logger.info('✅ Default admin created: admin@vitechs.com / Admin@123456');
      } catch {
        // Đã tồn tại - bỏ qua
      }
    }

    app.listen(PORT, () => {
      logger.info(`🚀 Server running in ${NODE_ENV} mode on port ${PORT}`);
      logger.info(`📡 API: http://localhost:${PORT}${process.env.API_PREFIX || '/api/v1'}`);
    });
  } catch (error) {
    logger.error('❌ Unable to start server:', error);
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received. Closing database connection...');
  await sequelize.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('SIGINT received. Closing database connection...');
  await sequelize.close();
  process.exit(0);
});

startServer();
