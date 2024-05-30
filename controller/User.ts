import { getRepository } from 'typeorm';
import { User  } from "../entity/persion";
import { NextFunction, Request, Response } from 'express';
import { asgnErrorHandling } from "../AsynError/asynError";

import bcrypt from 'bcrypt';
const saltRounds = 10;

/// UserSign....
export const UserSign = asgnErrorHandling (async (req: Request, res: Response,next: NextFunction) => {
  const userRepository = getRepository(User);
  const {confirm_pasword,...rest}=req.body
  const hashPassword = await bcrypt.hash(confirm_pasword,10)
  const result = await userRepository.save({
    ...rest,
    confirm_pasword:hashPassword
  })
  if (result) {
    res.json({
      status:200,
      message:"User Sign Success",
      result:result
    })
  }else{
    res.json({
      status:400,
      message:"User Sign Fail"
    })
  }
})

/// UserVerifications...
export const UserVerified = async (req: Request, res: Response) => {
  res.status(201).json({
    message:"user verified succesfully"
  })
};



