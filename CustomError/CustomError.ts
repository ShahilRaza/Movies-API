import { isInstance } from "class-validator";
import { NextFunction } from "express";
import { Request, Response, query } from "express";


export class CustomErrorHanding extends Error {
    statusCode: number;
    status: 'fail' | 'error';
    message:string
    isOperational=true
  constructor(message:string, statusCode: number) {
    super(message)
    this.statusCode = statusCode
    this.message=message
    this.status=statusCode>=400 && statusCode<500? 'fail': 'error'
    this.isOperational=true
    Error.captureStackTrace(this,this.constructor)
  }
}

export const DevErrorHandle = (error, res) => {
  console.log(error)
  return res.status(error.statusCode).json({
    statusCode: error.statusCode,
    message: error.message,
    stackTrace: error.stack,
    error: error,
  });
};

export const ProErrorHandle = (error, res) => {
  if (error.isOperational) {
    return res.status(error.statusCode).json({
      statusCode: error.statusCode,
      message: error.message,
    });
  } else {
    return res.status(500).json({
      status: 'error',
      message: 'something went wrong',
    });
  }
};

export const errorHandler = (error: Error, req: Request, res: Response, next: NextFunction) => {
  let err: CustomErrorHanding;

  if (error instanceof CustomErrorHanding) {
    err = error;
  }
  if (process.env.NODE_ENV === 'development') {
    DevErrorHandle(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    ProErrorHandle(err, res);
  }
};





