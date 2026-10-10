import express from "express";
import {
  createMember,
  getMembers,
  getMemberById,
  updateMember,
  deleteMember,
} from "../controllers/memberController.js";

const router = express.Router();

router.route("/").get(getMembers).post(createMember);
router.route("/:id").get(getMemberById).put(updateMember).delete(deleteMember);

export default router;