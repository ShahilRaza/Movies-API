import { getRepository } from "typeorm";
import { User, UserRole } from "../entity/persion";
import { NextFunction, Request, Response } from "express";
import { asgnErrorHandling } from "../AsynError/asynError";
import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";
import { CustomErrorHanding } from "../CustomError/CustomError";

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
      const error = new CustomErrorHanding("Internal Server Error", 500);
      next(error);
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
        const error = new CustomErrorHanding("Password Not Match", 400);
        next(error);
      }
    } else {
      const error = new CustomErrorHanding("Internal Server Error", 500);
      next(error);
    }
  }
);

//UserVerifications...
export const changePassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { oldPassword, newPassword } = req.body;
  console.log(oldPassword, newPassword);
  const token = req.headers.authorization.split(" ")[1];
  let decoded = jwt.verify(token, process.env.SECRETE_KEY);
  let id = (decoded as JwtPayload).id as string;
  const userRepository = getRepository(User);
  const user = await userRepository.findOne({ where: { id: id } });
  if (!user) {
    const error = new CustomErrorHanding("User Not Found", 404);
    next(error);
  }
  const isMatch = await bcrypt.compare(oldPassword, user.confirm_pasword);
  if (!isMatch) {
    const error = new CustomErrorHanding("Old Password Not Match", 400);
    next(error);
  } else {
    const hashPassword = await bcrypt.hash(newPassword, 10);
    const newData = await userRepository.update(user.id, {
      confirm_pasword: hashPassword,
    });
    const data = { ...newData.raw };
    res.json({
      status: 200,
      message: "Password Changed Successfully",
      result: data,
    });
  }
};
