import { NextFunction } from 'express';
import { CustomErrorHanding } from '../CustomError/CustomError';

export const asgnErrorHandling = (func) => {
  return (req: Request, res: Response, next: NextFunction) => {
    func(req, res, next).catch((error) => {
      const err = new CustomErrorHanding(error.message, error.statusCode || 500);
      next(err);
    });
  };
};