import { getRepository } from "typeorm";
import { User, UserRole } from "../entity/persion";
import { NextFunction, Request, Response } from "express";
import { asgnErrorHandling } from "../AsynError/asynError";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const saltRounds = 10;

export const JwtToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.SECRETE_KEY, {
    expiresIn: process.env.TokenExpire,
  });
};

/// UserSign....
export const UserSigup = asgnErrorHandling(
  async (req: Request, res: Response, next: NextFunction) => {
    const userRepository = getRepository(User);
    const { confirm_pasword, role, ...rest } = req.body;
    const hashPassword = await bcrypt.hash(confirm_pasword, 10);
    if (role && !Object.values(UserRole).includes(role)) {
      return res.status(400).json({
        status: 400,
        message: `Invalid role value. Allowed values are: ${Object.values(
          UserRole
        ).join(", ")}`,
      });
    }
    const result = await userRepository.save({
      ...rest,
      confirm_pasword: hashPassword,
      role: role || "user",
    });
    if (result) {
      const jwtToken = await JwtToken(result.id, result.role);
      res.json({
        status: 200,
        message: "User Sign Success",
        result: result,
        token: jwtToken,
      });
    } else {
      res.json({
        status: 400,
        message: "User Sign Fail",
      });
    }
  }
);

/// user Login
export const loginUser = asgnErrorHandling(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    const userRepository = getRepository(User);
    const user = await userRepository.findOne({
      where: {
        email: email,
      },
    });
    if (user) {
      console.log(user, "hasi");
      const isMatch = await bcrypt.compare(password, user.confirm_pasword);
      if (isMatch) {
        const jwtToken = await JwtToken(user.id, user.role);
        res.json({
          status: 200,
          message: "Login Success",
          result: user,
          token: jwtToken,
        });
      } else {
        res.json({
          status: 400,
          message: "Plz enter your Correct Password",
        });
      }
    } else {
      res.json({
        status: 400,
        message: "User Not Found",
      });
    }
  }
);

//UserVerifications...
export const UserVerified = async (req: Request, res: Response) => {
  res.status(201).json({
    message: "user verified succesfully",
  });
};
