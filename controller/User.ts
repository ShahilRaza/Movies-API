import { getRepository } from 'typeorm';
import { User  } from "../entity/persion";
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
const saltRounds = 10;

/// UserSign....
export const UserSign = async (req: Request, res: Response) => {
  try {
    const { name, password, email, confirmpassword } = req.body;
    const userRepository = getRepository(User);
    const existingUser = await userRepository.findOne({
      where: { email }
    });
    if (existingUser) {
      return res.status(400).json({
        message: "User with this email already exists"
      });
    } else {
      if (!name || !password || !email || !confirmpassword) {
        return res.status(400).json({
          message: "Please fill all the fields"
        });
      }
      if (password ===confirmpassword) {
        bcrypt.hash(password, saltRounds,async (err, hashedPassword)=>{
          if (err) {
            console.error('Error hashing password:', err);
            return res.status(500).json({ message: 'Internal server error' });
          }else{
            await userRepository.save({
              username: name,
              password:  hashedPassword,
              email: email,
              confirm_pasword: confirmpassword
            });
            return res.status(201).json({
              message: "User created successfully"
            });
          }
        })
      } else {
        return res.status(400).json({
          message: "Passwords do not match",
        });
      }
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

/// UserVerifications...
export const UserVerified = async (req: Request, res: Response) => {
  res.status(201).json({
    message:"user verified succesfully"
  })
};



