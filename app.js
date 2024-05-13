"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const typeorm_1 = require("typeorm");
require("reflect-metadata");
const app = (0, express_1.default)();
const port = 4011;
app.get("/test", (req, res) => {
    res.json({
        message: "hello world"
    });
});
const Appdata = new typeorm_1.DataSource({
    type: "postgres",
    host: 'localhost',
    username: 'postgres',
    password: 'Shariq@123',
    port: 5432,
    database: 'India',
});
Appdata.initialize().then(() => {
    console.log("connected");
}).catch((err) => {
    console.log(`connection failed ${err}`);
});
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
