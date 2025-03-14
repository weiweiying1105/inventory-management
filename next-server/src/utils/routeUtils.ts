import { Router } from "express";

export const createPrefixRouter = (prefix: string) => {
  const router = Router();
  return {
    router,
    route: (path: string = '') => `${prefix}${path}`
  }
}