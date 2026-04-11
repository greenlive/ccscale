export default () => ({
  port: parseInt(process.env.PORT, 10) || 8000,
  database: {
    url: process.env.DATABASE_URL || 'postgresql://ccscale:ccscale123@localhost:5432/ccscale',
  },
  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
  },
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  },
});
