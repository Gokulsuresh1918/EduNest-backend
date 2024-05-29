const jwt = require('jsonwebtoken');

const verifyToken = (req: { headers: { authorization: string; }; body: { userId: any; }; }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { error: string; }): void; new(): any; }; }; }, next: () => void) => {
  try {
    const token = req.headers.authorization? req.headers.authorization.split(' ')[1] : null;
    if (!token) {
      return res.status(401).json({ error: 'No token provided.' });
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const userId = decodedToken.userId;

    if (req.body.userId && req.body.userId!== userId) {
      throw 'Invalid user ID';
    } else {
      next();
    }
  } catch (error) {
    res.status(401).json({ error: 'Invalid request!' });
  }
};
export  default verifyToken