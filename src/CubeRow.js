import React from "react";
import "./App.css";
import { Grid, Paper } from "@material-ui/core";

function CubeRow(props) {
	console.log("CubeRow.js: props");
	console.log(props);
	if (props.face === undefined || props.row === undefined) return;

	let piecesOfRow = [];
	for (const colNum in props.face.grid[props.row]) {
		const coordinates = props.face["grid"][props.row][colNum].coordinates;
		piecesOfRow[colNum] = (
			<Grid item>
				<Paper
					className={`cubepiece ${
						props.face.grid[props.row][colNum]["color"]
					}`}
				>
					({coordinates.x}, {coordinates.y}, {coordinates.z})
				</Paper>
			</Grid>
		);
	}

	const leftIndex = props.face.rowColTopLeft[1];
	const rightIndex = leftIndex === 1 ? -1 : 1;

	let row = (
		<Grid container xs={12} className="cubeRow">
			{piecesOfRow[leftIndex]}
			{piecesOfRow[0]}
			{piecesOfRow[rightIndex]}
		</Grid>
	);

	return <>{row}</>;
}

export default CubeRow;
