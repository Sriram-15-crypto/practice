const jwt = require('jsonwebtoken'); // Import jwt library for token verification
const CONFIG = require('../config/config'); // Import your configuration

// Middleware function for securing routes with JWT token verification
module.exports.secureMiddleware = (req, res, next) => {
  const token = req.headers.authorization; // Retrieve the token from the request's authorization header
  console.log("Your Token : ", token);

  if (!token) {
    // If no token is provided, return a 401 Unauthorized response with a message
    return res.status(401).json({ message: 'UNAUTHORIZED RESPONSE' });
  }

  // Verify the token using the jwtSecret from your configuration
  jwt.verify(token, CONFIG.jwtSecret, (err, decoded) => {
    if (err) {
      // If token verification fails (e.g., expired or invalid token), log an error and return a 401 Unauthorized response with a message
      console.error("INVALID TOKEN / TOKEN NOT VERIFIED:", err);
      return res.status(401).json({ message: 'TOKEN VERIFICATION FAILED' });
    }

    // If the token is valid, attach the decoded user data to the request object for use in subsequent middleware or route handlers
    req.user = decoded;
    next(); // Continue to the next middleware or route handler

  });
};
