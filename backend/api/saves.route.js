import express from "express";
import SavesCtrl from "./saves.controller.js";

const router = express.Router();

router
	.route("/")
	.get(SavesCtrl.apiGetSaves)
	.post(SavesCtrl.apiPostNewSave)
	.put(SavesCtrl.apiUpdateSave)
	.delete(SavesCtrl.apiDeleteSave);

router.route("/getAll").get(SavesCtrl.apiGetAllSaves);

export default router;
