
require('dotenv').config();  // Add this line at the top


// backend/config/index.js
// module.exports = {
//     environment: process.env.NODE_ENV || 'development',
//     port: process.env.PORT || 8000,
//     dbFile: process.env.DB_FILE,
//     jwtConfig: {
//       secret: process.env.JWT_SECRET,
//       expiresIn: process.env.JWT_EXPIRES_IN
//     }
//   };

  console.log(process.env.JWT_SECRET);  // Log to check the value of JWT_SECRET
module.exports = {
  environment: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 8000,
  dbFile: process.env.DB_FILE,
  jwtConfig: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN
  }
};
