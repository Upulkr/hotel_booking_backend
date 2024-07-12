import { Router } from "express";
import authRoutes from "./auth.js";
import bookRoutes from "./booking.js";

const rootRouter = Router();

rootRouter.use("/auth", authRoutes);
rootRouter.use("/booking", bookRoutes);

export default rootRouter;
