import { Router } from "express";
import { getUsers } from "../controllers/userController";

const route = Router();

route.get('/', getUsers)


export default route;