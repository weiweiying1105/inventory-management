/**
 * 
 */

import { RequestHandler } from 'express';

export const openidMiddleware: RequestHandler = (req, res, next) => {
  const openid = req.headers['openid'];
  if (typeof openid !== 'string') {
    return res.status(200).json({ code: 401, error: 'openid不能为空' });
  }
  next();
};

export default openidMiddleware;