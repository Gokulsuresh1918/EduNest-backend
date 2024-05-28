import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

interface User {
  userId: string;
  username: string;
  email: string;
}

// Extend the Request interface to include a user property
interface ExtendedRequest extends Request {
  user?: User;
}

// Middleware to verify JWT token from cookies
const verifyToken = (req: ExtendedRequest, res: Response, next: NextFunction) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  try {
    // Verify the token
    const decoded: User = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET) as User;
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Error verifying token:", error);
    return res.status(403).json({ error: "Invalid token." });
  }
};

export default verifyToken;
