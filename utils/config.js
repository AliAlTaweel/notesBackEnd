require('dotenv').config()

const PORT = process.env.VITE_PORT
const MONGODB_URI = process.env.MONGODB_URI

module.exports = {
  MONGODB_URI,
  PORT,
}
