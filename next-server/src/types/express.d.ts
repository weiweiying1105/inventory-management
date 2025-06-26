
declare namespace Express {
  export interface Request {
    openid?: string;
    user?: {
      userId: number;
      iat: number;
      exp: number;
    }
  }
}