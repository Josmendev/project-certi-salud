export default () => ({
  server: {
    port: process.env.SERVER_PORT,
  },
  db: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
  },
  reniecApi: {
    url: process.env.RENIEC_API_URL,
    apiKey: process.env.RENIEC_API_KEY,
  },
  hashSalt: process.env.HASH_SALT,
  redis: {
    url: process.env.REDIS_URL,
  },
});
