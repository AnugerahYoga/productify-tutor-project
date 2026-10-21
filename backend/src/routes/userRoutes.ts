import { Router } from "express";
import { userSync } from "../controllers/userControllers";
import { requireAuth } from "@clerk/express";

const router = Router();

// /api/users/sync => POST => sync the clerk user to db (PROTECTED)
router.post("/sync", requireAuth(), userSync);

export default router;
