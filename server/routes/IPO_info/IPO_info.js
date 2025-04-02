
import express from "express"
import { deleteIpo, getAllIPOs, getIPOById, getUserIPOs, registerIpo, updateIPO } from "../../controller/Ipoinfocontroller.js";
import upload from "../../config/upload.js";
import AuthMiddleware from "../../middleware/AuthMiddleware.js";

const router = express.Router();
router.get("/",getAllIPOs),
router.get("/useripo/",AuthMiddleware,getUserIPOs);
router.get("/:id",getIPOById)
router.post("/register",  upload.fields([
    { name: "company_logo_path", maxCount: 1 },
    { name: "rhp", maxCount: 1 },
    { name: "drhp", maxCount: 1 }
]), registerIpo);

router.delete("/delete/:id",deleteIpo);
router.put("/update/:id",  upload.fields([
    { name: "company_logo_path", maxCount: 1 },
    { name: "rhp", maxCount: 1 },
    { name: "drhp", maxCount: 1 }
]), updateIPO);
export default router;