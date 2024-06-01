import { getRepository } from 'typeorm';
import { User  } from "../entity/persion";
import { NextFunction, Request, Response } from 'express';
import { asgnErrorHandling } from "../AsynError/asynError";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


const saltRounds = 10;

export const JwtToken=(id)=>{
 return jwt.sign({id}, process.env.SECRETE_KEY,{expiresIn:process.env.TokenExpire})
}

/// UserSign....
export const UserSigup = asgnErrorHandling (async (req: Request, res: Response,next: NextFunction) => {
  const userRepository = getRepository(User);
  const {confirm_pasword,...rest}=req.body
  const hashPassword = await bcrypt.hash(confirm_pasword,10)
  const result = await userRepository.save({
    ...rest,
    confirm_pasword:hashPassword
  })
  if (result) {
    const jwtToken =await JwtToken(result.id)
    res.json({
      status:200,
      message:"User Sign Success",
      result:result,
      token:jwtToken
    })
  }else{
    res.json({
      status:400,
      message:"User Sign Fail"
    })
  }
})

/// user Login
export const loginUser = asgnErrorHandling (async (req: Request, res: Response,next: NextFunction) => {
  const {email,password}=req.body
  const userRepository = getRepository(User);
  const user = await userRepository.findOne({where:{
    email:email
  },
});
  if (user) {
    const isMatch = await bcrypt.compare(password,user.confirm_pasword)
    if (isMatch) {
      const jwtToken= await JwtToken(user.id)
      res.json({
        status:200,
        message:"Login Success",
        result:user,
        token:jwtToken
      })
    }else{
      res.json({
        status:400,
        message:"Plz enter your Correct Password"
      })
    }
  }else{
    res.json({
      status:400,
      message:"User Not Found",
    })
  }
})


 //UserVerifications...
export const UserVerified = async (req: Request, res: Response) => {
  res.status(201).json({
    message:"user verified succesfully"
  })
};



