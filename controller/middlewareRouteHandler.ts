import { NextFunction, Request, Response } from "express";

import { ValidationChain, body, validationResult } from "express-validator";
import jwt, { JwtPayload } from "jsonwebtoken";
import { getRepository } from "typeorm";
import { User } from "../entity/persion";
import { CustomErrorHanding } from "../CustomError/CustomError";
export const SortmoviesMiddlewareDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { sort } = req.query;
    if (sort && Array.isArray(sort)) {
      console.log(sort);
    }
  } catch (error) {
    console.error(error);
    res.status(404).json({
      status: "Fail",
      message: "Not Found",
    });
  }
};

export const protectRoute = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    try {
      const token = req.headers.authorization.split(" ")[1];
      let decoded = jwt.verify(token, process.env.SECRETE_KEY);
      let id = (decoded as JwtPayload).id as string;
      const userRepository = getRepository(User);
      const user = await userRepository.findOne({ where: { id: id } });
      if (!user) {
        const error = new CustomErrorHanding(
          "the User with given token does not exits ",
          401
        );
        next(error);
      } else {
        next();
      }
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        const error = new CustomErrorHanding(
          "Your token has expired! Please log in again",
          401
        );
        next(error);
      } else if (error.name === "JsonWebTokenError") {
        const error = new CustomErrorHanding("invalid signature", 401);
        next(error);
      }
    }
  } else {
    res.status(401).json({
      status: "Fail",
      message: "You are not logged in! Please log in to get access",
    });
  }
};

export const checkRoleOfUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.SECRETE_KEY);
    if (!decoded || typeof decoded !== "object" || !("role" in decoded)) {
      return res
        .status(403)
        .json({ message: "Forbidden: No role found in token." });
    }
    const role = (decoded as any).role;
    if (!["admin", "superAdmin"].includes(role)) {
      return res
        .status(403)
        .json({ message: "Forbidden: You don't have the required role." });
    }
    next();
  } catch (error) {
    console.error("Error decoding token:", error);
    res.status(401).json({ message: "Unauthorized" });
  }
};

export const formDataValidatorMiddleware: ValidationChain[] = [
  body("title")
    .isString()
    .withMessage("Title must be a string")
    .isLength({ max: 50 })
    .withMessage("Title must be at most 50 characters long"),
  body("name")
    .isString()
    .withMessage("Name must be a string")
    .isLength({ max: 10 })
    .withMessage("Name must be at most 10 characters long"),
  body("duration")
    .isNumeric()
    .withMessage("Duration must be a number")
    .matches(/^\d+$/)
    .withMessage("Duration must be a positive integer"),
  body("rating")
    .isInt({ min: 1, max: 5 })
    .withMessage("Rating must be an integer between 1 and 5"),
  body("description")
    .isString()
    .withMessage("Description must be a string")
    .isLength({ max: 500 })
    .withMessage("Description must be at most 500 characters long"),
];

export const userRegistrationFormMiddleware: ValidationChain[] = [
  body("username").notEmpty().withMessage("Username is required"),
  body("email").isEmail().withMessage("Email is invalid"),
  body("password")
    .isLength({ min: 6, max: 10 })
    .withMessage("Password must be at least 6 characters long"),
  body("confirm_pasword")
    .custom((value, { req }) => value === req.body.password)
    .withMessage("plz check your confirm Password"),
];

export const userLogin: ValidationChain[] = [
  body("email").isEmail().withMessage("Email is invalid"),
  body("password")
    .isLength({ min: 6, max: 10 })
    .withMessage("Password must be at least 6 characters long"),
];


export const passwordValidations: ValidationChain[] = [
  body("oldPassword")
    .isString()
    .withMessage("Old password must be a string")
    .notEmpty()
    .withMessage("Old password is required"),
  body("newPassword")
    .isLength({ min: 6, max: 10 })
    .withMessage("Password must be between 6 and 10 characters long")
    .notEmpty()
    .withMessage("New password is required"),
];



export const handleValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};
