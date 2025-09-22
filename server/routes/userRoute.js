import express from "express";
import { create, deleteUser, getAll, getOne, groupUsers, update } from "../controller/userController.js";
import { loginUser, signupUser } from "../controller/authController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const route = express.Router();

route.post("/login",loginUser);
route.post("/signup",signupUser);


route.post("/create", authMiddleware, create);
route.get("/getAll", authMiddleware, getAll);
route.get("/getone/:id", authMiddleware, getOne);
route.put("/update/:id",authMiddleware, update);
route.delete("/delete/:id",authMiddleware, deleteUser);
route.get("/grouped-users",authMiddleware, groupUsers);

export default route;