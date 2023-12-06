const jwt = require('jsonwebtoken'); // Import JSON Web Token (JWT) library for authentication

// Authentication middleware function
const auth = (req, res, next) => {
  try {
    // Extract the JWT token from the Authorization header
    const token = req.header('Authorization').replace('Bearer ', '');

    // Verify and decode the JWT token using the secret key from environment variables
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the decoded user information to the request object for further use
    req.user = decoded;

    // Move to the next middleware or route handler
    next();
  } catch (e) {
    // If an error occurs (token verification fails), send a 401 Unauthorized response
    res.status(401).send({ message: 'Please authenticate.' });
  }
};

// Export the authentication middleware function to be used in other modules
module.exports = auth;

