import jwt from "jsonwebtoken";

// Function to check the validity of a JWT token
function checkJWT(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  console.log("Token:", token);

  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403); // invalid/expired
    req.user = user;
    next();
  });
}

export default checkJWT;
