/**
 * provides some utilities for db accesses
 */
import axios from "axios";

export default axios.create({
	baseURL: "http://localhost:5000/api/v1/sequences",
	
	headers: {
		"Content-type": "application/json",
	},
});

// may be able to use:
// 	baseURL: `http://localhost:${process.env.PORT}/api/v1/saves`,