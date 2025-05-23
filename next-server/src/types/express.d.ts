declare namespace Express {
  interface Request {
    user?: {
      userId: number;
      iat: number;
      exp: number;
    }
  }
}