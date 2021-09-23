import SavesDAO from "../dao/savesDAO.js";

export default class SavesController {
	static async apiGetSaves(req, res, next) {
		console.log("inside apiGetSaves");

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
			console.log(`req.query.name: ${req.query.name}`);
			filters.name = req.query.name;
		}

		const { sequenceList, totalNumSaves } = await SavesDAO.getSaves({
			filters,
			page,
			sequencesPerPage: sequencesPerPage,
		});

		const response = {
			sequenceList: sequenceList,
			page: page,
			filters: filters,
			entries_per_page: sequencesPerPage,
			total_results: totalNumSaves,
		};
		console.log("happy");
		console.log(response);
		res.json(response);
	}

	static async apiGetSavesById(req, res, next) {
		try {
			let id = req.body.id || {};
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

	// POST to /sequences. Saves a sequence by a name.
	static async apiPostNewSave(req, res, next) {
		try {
			const name = req.body.name;
			const sequence = req.body.sequence;

			if (
				name === undefined ||
				sequence === undefined ||
				sequence === ""
			) {
				console.log("req: ");
				console.log(req);
				throw new Error("malformatted save! req: " + req);
			}

			const postResponse = await SavesDAO.postNewSave(name, sequence); // not sure if correct?
			if (!sequence) {
				res.status(404).json({ error: "Not found" });
				return;
			}
			// happy path
			res.json(postResponse);
			console.log("happy");
		} catch (e) {
			console.log(`saves.controller.js: apiPostNewSave. error: `);
			console.log(e);
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
		try {
			let sequences = await SavesDAO.getSaves();
			if (!sequences) {
				res.status(404).json({ error: "Not found" });
				return;
			}
			console.log("saves.controller: apiGetAllSaves() returned:");
			console.log(sequences);
			res.json(sequences);
		} catch (e) {
			console.log(`api, ${e}`);
			res.status(500).json({ error: e });
		}
	}
}
