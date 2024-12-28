import jwt from 'jsonwebtoken';

export default async function authMiddleware(req, res, next) {
  const token = req.cookies.jwt;
  if (!token) {
    return res.status(401).json({message: "Unauthorized"});
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    console.error("Error verifying token", error);
    return res.status(401).json({message: "Unauthorized"});
  }
}