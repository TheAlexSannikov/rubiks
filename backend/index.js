import app from "./server.js";
import mongodb from "mongodb";
import dotenv from "dotenv";
import RestaurantsDAO from "./dao/restaurantsDAO.js"
import ReviewsDAO from "./dao/reviewsDAO.js"

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
		await RestaurantsDAO.injectDB(client);	// get initial reference to restaurant's collection in DB
		await ReviewsDAO.injectDB(client);	// get initial reference to restaurant's collection in DB
		app.listen(port, () => {
			console.log(`listening on port ${port}`);
		});
	});
