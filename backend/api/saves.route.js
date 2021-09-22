import express from "express";
import SavesCtrl from "./saves.controller.js";

const router = express.Router();

router
	.route("/")
	.post(SavesCtrl.apiPostNewSave)
	.put(SavesCtrl.apiUpdateSave)
	.delete(SavesCtrl.apiDeleteSave);

router.route("/find").get(SavesCtrl.apiGetSaves);

router.route("/getAll").get(SavesCtrl.apiGetAllSaves);

export default router;
