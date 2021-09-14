import React from "react";
import "./App.css";
import { Grid, Paper } from "@material-ui/core";

function CubeRow(props) {
	if (props.face === undefined || props.row === undefined) return;


	let piecesOfRow = [];
	for (const colNum in props.face.grid[props.row]) {
		const coordinates = props.face.grid[props.row][colNum].coordinates;
		piecesOfRow[colNum] = (
			<Grid item xs={4}> 
				<Paper
					className={`cube_piece ${
						props.face.grid[props.row][colNum].color
					}`}
				>
					({coordinates[0]}, {coordinates[1]}, {coordinates[2]})
				</Paper>
			</Grid>
		);
	}

	const leftIndex = props.face.rowColTopLeft[1];
	const rightIndex = leftIndex === 1 ? -1 : 1;

	let row = (
		<Grid container className="cubeRow">
			{piecesOfRow[leftIndex]}
			{piecesOfRow[0]}
			{piecesOfRow[rightIndex]}
		</Grid>
	);

	return <>{row}</>;
}

export default CubeRow;
