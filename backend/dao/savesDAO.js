import mongodb from "mongodb";
const ObjectId = mongodb.ObjectId;
let sequences;

export default class SavesDAO {
	static async injectDB(conn) {
		if (sequences) {
			return;
		}
		try {
			sequences = await conn
				.db(process.env.SAVES_NS)
				.collection("sequences");
		} catch (e) {
			console.error(
				`Unable to establish a collection handle in savesDAO: ${e}`
			);
		}
	}

	// gets all saved sequences.
	static async getAllSaves() {
		return this.getSaves(null, 0, 5000000);
	}

	/**
	 * gets all saved sequences in the db.
	 * filters:
	 * 	can be:	'sequenceStartsWith: <string>'
	 * 			'name: <string>'
	 * 			'dateRange: {<after>, <before>}'
	 */
	static async getSaves({
		filters = null,
		page = 0,
		savesPerPage = 20,
	} = {}) {
		let query;

		// handle each filter.
		if (filters) {
			if ("sequenceStartsWith" in filters) {
				query = { $text: { $search: filters["sequenceStartsWith"] } };
			} else if ("name" in filters) {
				query = { $text: { $search: filters["name"] } };
			} else if ("dateRange" in filters) {
				if (
					filters["dateRange"]["after"] === undefined ||
					filters["dateRange"]["before"] === undefined
				) {
					throw new Error(
						"filter is malformatted. It needs a <after> and <before> date:" +
							filter
					);
				}

				query = {
					dateCreated: {
						$gte: filters["dateRange"]["after"],
						$lte: filters["dateRange"]["before"],
					},
				};
			}
		}

		let cursor;

		try {
			cursor = await sequences.find(query);
		} catch (e) {
			console.error(`Unable to issue find command, ${e}`);
			return { sequenceList: [], totalNumSequences: 0 };
		}

		const displayCursor = cursor
			.limit(savesPerPage)
			.skip(savesPerPage * page);

		try {
			const sequenceList = await displayCursor.toArray();
			const totalNumSequences = await sequences.countDocuments(query);

			return { sequenceList, totalNumSequences };
		} catch (e) {
			console.error(
				`Unable to convert cursor to array or problem counting documents, ${e}`
			);
			return { sequenceList: [], totalNumSequences: 0 };
		}
	}

	static async getSaveById(id) {
		try {
			const pipeline = [
				{
					$match: {
						_id: new ObjectId(id),
					},
				},
			];
			return await restaurants.aggregate(pipeline).next();
		} catch (e) {
			console.error(`Something went wrong in getSaveById: ${e}`);
			throw e;
		}
	}

	// attempts to add a sequence to db.
	static async postNewSave(name, sequence) {
		try {
			const sequenceToBeSaves = {
				name: name,
				sequence: sequence,
				date: new Date(),
			};

			return await sequences.insertOne(sequenceToBeSaves);
		} catch (e) {
			console.error(`savesDAO.js: Unable to post sequence: ${e}`);
			return { error: e };
		}
	}
}
