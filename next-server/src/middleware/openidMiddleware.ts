/**
 * 
 */

import { RequestHandler } from 'express';

export const openidMiddleware: RequestHandler = (req, res, next) => {
  const openid = req.headers['openid'];
  if (typeof openid !== 'string') {
    return res.status(400).json({ error: 'openid不能为空' });
  }
  next();
};

export default openidMiddleware;