import SavesDAO from "../dao/savesDAO.js";

export default class SavesController {
	static async apiGetSaves(req, res, next) {
		const sequencesPerPage = req.query.sequencesPerPage
			? parseInt(req.query.sequencesPerPage, 10)
			: 20;
		const page = req.query.page ? parseInt(req.query.page, 10) : 0;

		let filters = {};
		if (req.query.dateRange) {
			filters.dateRange = req.query.dateRange;
		} else if (req.query.sequenceStartsWith) {
			filters.sequenceStartsWith = req.query.sequenceStartsWith;
		} else if (req.query.name) {
			filters.name = req.query.name;
		}

		const { sequenceList, totalNumSaves } = await SavesDAO.getSaves({
			filters,
			page,
			sequencesPerPage: sequencesPerPage,
		});

		const response = {
			saves: sequenceList,
			page: page,
			filters: filters,
			entries_per_page: sequencesPerPage,
			total_results: totalNumSaves,
		};
		res.json(response);
	}

	static async apiGetSavesById(req, res, next) {
		try {
			let id = req.params.id || {};
			let sequence = await SavesDAO.getSaveById(id);
			if (!sequence) {
				res.status(404).json({ error: "Not found" });
				return;
			}
			res.json(sequence);
		} catch (e) {
			console.log(`api, ${e}`);
			res.status(500).json({ error: e });
		}
	}

	// saves a sequence by a name. POST.
	static async apiPostNewSave(req, res, next) {
		try {
			const name = req.params.name;
			const sequence = req.params.name;
			const date = new Date();

			if (name === undefined || sequence === undefined || sequence === "")
				throw new Error("malformatted save! req: " + req);

			const postResponse = await SavesDAO.postNewSave(name, sequence); // not sure if correct?
			if (!sequence) {
				res.status(404).json({ error: "Not found" });
				return;
			}
			// happy path
			res.json(postResponse); 

		} catch (e) {
			console.log(`api, ${e}`);
			res.status(500).json({ error: e });
		}
	}

	static async apiUpdateSave(req, res, next) {
		console.error(
			`inside unimplemented method: SavesController.apiUpdateSave()`
		);
	}

	static async apiDeleteSave(req, res, next) {
		console.error(
			`inside unimplemented method: SavesController.apiDeleteSave()`
		);
	}
	
	static async apiGetAllSaves(req, res, next) {

		console.error(
			`inside unimplemented method: SavesController.apiGetAllSaves()`
		);
	}
}
