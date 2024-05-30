import { NextFunction, Request, Response } from "express";
import { ValidationChain, body, check, validationResult } from 'express-validator';
export const SortmoviesMiddlewareDetails = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {sort}= req.query
      if (sort && Array.isArray(sort)) {
         console.log(sort)
      }
    } catch (error) {
      console.error(error);
      res.status(404).json({
        status: "Fail",
        message: "Not Found",
      });
    }
  };

 export const formDataValidatorMiddleware:ValidationChain[]=[
  body('title').isString().withMessage('Title must be a string').isLength({ max: 50 }).withMessage('Title must be at most 50 characters long'),
  body('name').isString().withMessage('Name must be a string').isLength({ max: 10 }).withMessage('Name must be at most 10 characters long'),
  body('duration').isNumeric().withMessage('Duration must be a number').matches(/^\d+$/).withMessage('Duration must be a positive integer'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be an integer between 1 and 5'),
  body('description').isString().withMessage('Description must be a string').isLength({ max: 500 }).withMessage('Description must be at most 500 characters long'),
 ]

 export  const  userRegistrationFormMiddleware:ValidationChain[]=[
  body('username').notEmpty().withMessage('Username is required'),
  body('email').isEmail().withMessage('Email is invalid'),
  body('password').isLength({ min: 6 ,max:10}).withMessage('Password must be at least 6 characters long'),
  body('confirm_pasword').custom((value, { req }) => value === req.body.password).withMessage('plz check your confirm Password')
 ]

 export  const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
}



