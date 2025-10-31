const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const { NODE_ENV = "development" } = process.env;

module.exports = { JWT_SECRET, NODE_ENV };
