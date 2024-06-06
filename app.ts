import { CustomErrorHanding, errorHandler} from "./CustomError/CustomError";
import { NextFunction } from "express";
import { Request, Response, query } from "express";



const express = require("express");
const bodyParser = require("body-parser");
const router = require("./Router/router");
const session = require("express-session");
const path = require("path");
const { createConnection } = require("typeorm");

const envFilePath = path.resolve(__dirname, ".env");
require("dotenv").config({ path: envFilePath });

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));



app.use("/api/user", router)

// Serve static files from the `public`
app.all("*", (req: Request, res: Response, next: NextFunction) => {
  const err= new CustomErrorHanding(`can not find  the ${req.originalUrl} URL`,404); 
  console.log(err)
  next(err);
});
app.use(errorHandler);



const port = 4013;
const server=createConnection("default")
  .then(() => {
    console.log("Connected to the database");
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })

//// this code all rejection promises
process.on('unhandledRejection', (error: Error) => {
    const err = error as any; 
    if (err && err.code === '28P01' && err.severity === 'FATAL') {
      console.error('unhandle the Rejection occured! shuttingdown',error.message);
    } else {
      //console.error("An error occurred while connecting to the database:", error.message);
    }
   
  process.exit(1);
  });



