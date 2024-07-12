import express from "express";
import cors from "cors";
import { PORT } from "./src/secrets.js";
import rootRouter from "./src/routes/index.js";
import { PrismaClient } from "@prisma/client";
import { errorMiddleware } from "./src/middlewares/errors.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api", rootRouter);
export const prismaclient = new PrismaClient({
  log: ["query"],
})

app.use(errorMiddleware);
app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
