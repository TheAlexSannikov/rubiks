import app from "./server.js";
import mongodb from "mongodb";
import dotenv from "dotenv";
import SavesDAO from "./dao/savesDAO.js";
import ReviewsDAO from "./dao/reviewsDAO.js";

dotenv.config();
const MongoClient = mongodb.MongoClient;

const port = process.env.PORT || 8000;

MongoClient.connect(process.env.RESTREVIEWS_DB_URI, {
	wtimeoutMS: 2500,
})
	.catch((err) => {
		console.error(err.stack);
		process.exit(1);
	})
	.then(async (client) => {
		await SavesDAO.injectDB(client); // get initial reference to saved sequence collection in DB
		app.listen(port, () => {
			console.log(`listening on port ${port}`);
		});
	});
