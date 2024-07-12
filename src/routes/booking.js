import { Router } from "express";
import {
  book,
  deletebook,
  getbook,
  getbookone,

  updatebook,
} from "../controllers/booking.js";

const bookRoutes = Router();

bookRoutes.post("/book", book);
bookRoutes.delete("/deletebook", deletebook);
bookRoutes.put("/updatebook", updatebook);
bookRoutes.get("/getbook", getbook);
bookRoutes.get("/getbookone", getbookone);

export default bookRoutes;
