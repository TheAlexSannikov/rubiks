import React from "react";

import { Grid, Paper } from "@material-ui/core";

function CubeRow(props) {
     console.log("CubeRow.js: props");
     console.log(props);
	if (props.row === undefined) return;

	console.log("props.row");
	console.log(props.row);

	let piecesOfRow = [];
	for (const colNum in props.row) {
		piecesOfRow[colNum] = (
			<Grid item xs={4}>
				<Paper
					className={`cubepiece ${props.row[colNum]["color"]}`}
                         piece={props.row[colNum]}     // might be useful to have this information
				>( {props.row[colNum].coordinates.x}, {props.row[colNum].coordinates.y}, {props.row[colNum].coordinates.z} )</Paper>
			</Grid>
		);
	}

	// construct row using piecesOfRow
	let row = (
		<Grid item xs={4}>
			{piecesOfRow[-1]}
			{piecesOfRow[0]}
			{piecesOfRow[1]}
		</Grid>
	);

	return <>{row}</>;
}

export default CubeRow;
