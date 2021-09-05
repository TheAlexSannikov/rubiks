import React from "react";
import "./App.css";
import { Grid } from "@material-ui/core";
import CubeFace from "./CubeFace";
// import cubeSaveState from "./CubeSaveState"

const colors = ["WHITE", "BLUE", "RED", "GREEN", "ORANGE", "YELLOW"]; // dictates the starting position; and center pieces
const faceNames = ["BOTTOM", "FRONT", "RIGHT", "BACK", "LEFT", "TOP"];
const initialFaceColors = {
	FRONT: "BLUE",
	BACK: "GREEN",
	RIGHT: "RED",
	LEFT: "ORANGE",
	BOTTOM: "WHITE",
	TOP: "YELLOW",
};
const axes = { x: "X", y: "Y", z: "Z" };

const rotationDirs = { cw: -90, ccw: +90 };

const pieceFilter = {
	posX: "POSX",
	negX: "NEGX",
	posY: "POSY",
	negY: "NEGY",
	posZ: "POSZ",
	negZ: "NEGZ",
};

// each face is either +/-1 in one of three dimensions
// const faceCoords = {
// 	FRONT: (1, 0, 0),
// 	BACK: (-1, 0, 0),
// 	RIGHT: (0, 1, 0),
// 	LEFT: (0, -1, 0),
// 	TOP: (0, 0, 1),
// 	BOTTOM: (0, 0, -1),
// };
// used during initalization. Not sure if row & col need +/- differentiation
const faceCoords = {
	FRONT: { frozen: "+X", row: "Y", col: "Z" },
	BACK: { frozen: "-X", row: "Y", col: "Z" },
	RIGHT: { frozen: "+Y", row: "X", col: "Z" },
	LEFT: { frozen: "-Y", row: "X", col: "Z" },
	TOP: { frozen: "+Z", row: "Y", col: "X" },
	BOTTOM: { frozen: "-Z", row: "Y", col: "X" },
};
// const newCubeSaveState =

class Cube extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			cube: {},
		};
		this.lookToRightFace = this.lookToRightFace.bind(this);
		this.lookToLeftFace = this.lookToLeftFace.bind(this);
		this.lookToTopFace = this.lookToTopFace.bind(this);
		this.lookToBottomFace = this.lookToBottomFace.bind(this);
		this.rotateFrontCW = this.rotateFrontCW.bind(this);
		this.rotateFront180Deg = this.rotateFront180Deg.bind(this);
		this.rotateFrontCCW = this.rotateFrontCCW.bind(this);
		this.makeTopBlack = this.makeTopBlack.bind(this); //debug purposes
		this.getTopControls = this.getTopControls.bind(this);
		this.getBottomControls = this.getBottomControls.bind(this);
	}

	componentDidMount() {
		this.loadInitialState();
	}

	loadInitialState_OLD() {
		let newFaces = {};

		for (let i = 0; i < 6; i++) {
			let face = []; // row col

			const color = colors[i];
			for (let row = 0; row < 3; row++) {
				let col = [color, color, color];
				face.push(col);
			}
			newFaces[faceNames[i]] = face;
		}

		this.setState({ faces: newFaces });
		// console.log(this.state.cube);
	}

	// helper to loadInitialState. frozenCoord is set to +/- 1.5, other coordinates depend on row/col
	createPiece(faceName, row, col, color) {
		const frozenCoord = faceCoords[faceName].frozen;
		const rowCoord = faceCoords[faceName].row;
		const colCoord = faceCoords[faceName].col;
		let coordinates = {};
		switch (frozenCoord) {
			case "+X":
				coordinates = { x: 1.5, y: row, z: col };
				break;
			case "-X":
				coordinates = { x: -1.5, y: row, z: col };
				break;
			case "+Y":
				coordinates = { x: row, y: 1.5, z: col };
				break;
			case "-Y":
				coordinates = { x: row, y: -1.5, z: col };
				break;
			case "+Z":
				coordinates = { x: col, y: row, z: 1.5 };
				break;
			case "-Z":
				coordinates = { x: col, y: row, z: -1.5 };
				break;

			default:
				throw new Error("frozenCoord does not have a valid case!");
		}
		return { color: color, coordinates: coordinates };
	}

	async loadInitialState() {
		let newCube = {};
		for (const faceName of faceNames) {
			let newFace = {};
			newFace.faceName = faceName;

			const color = initialFaceColors[faceName];
			if (faceCoords[faceName] == undefined)
				throw new Error("faceName is undefined");

			// write data to each face
			for (let row = -1; row < 2; row++) {
				newFace[row] = {};
				for (let col = -1; col < 2; col++) {
					const newPiece = this.createPiece(
						faceName,
						row,
						col,
						color
					);
					newFace[row][col] = newPiece;
				}
			}
			newCube[faceName] = newFace;
		}

		await this.setState({ cube: newCube });
		// console.log("this.state.cube:");
		// console.log(this.state.cube);
	}

	// use rotation matrix
	/**
	 * modifies cube according to a rotation. effects 5 sides.
	 * face is the face where rotation happens
	 * dir is either ccw or cw
	 */
	rotateFace(faceOfRotation, dir) {
		// assume face == front for now. TODO: make versatile
		// front: positive x
		// add to sequence
		// perform rotation on all points with positive x
		// find all positive x
		// rotate

		switch (faceOfRotation) {
			case "FRONT":
				this.rotateHelper(pieceFilter.posX, axes.X, dir);
				break;
			case "BACK":
				this.rotateHelper(pieceFilter.negX, axes.X, dir); // mirror this?
				break;

			default:
				throw new Error("rotate called with an invalid face");
		}
	}

	//performs actual rotation, updating this.state.cube
	rotateHelper(filter, axis, degrees) {
		// filter out pieces that match the filter. Look through each face.
		for (const face in this.state.cube) {
			console.log(face);
		}
	}

	// rotates all faces matching the filter along the specified axis by specified degrees
	rotateHelper(filter, axisOfRotation, degrees) {}

	lookToRightFace() {
		const faces = this.state.cube;
		let newFaces = {};
		newFaces["FRONT"] = faces["RIGHT"];
		newFaces["RIGHT"] = faces["BACK"];
		newFaces["BACK"] = faces["LEFT"];
		newFaces["LEFT"] = faces["FRONT"];

		newFaces["TOP"] = this.rotateFace(faces["TOP"], "cw");
		newFaces["BOTTOM"] = this.rotateFace(faces["BOTTOM"], "ccw");
		this.setState({ faces: newFaces });
		// console.log(this.state.cube);
	}

	lookToLeftFace() {
		const faces = this.state.cube;
		let newFaces = {};
		newFaces["FRONT"] = faces["LEFT"];
		newFaces["LEFT"] = faces["BACK"];
		newFaces["BACK"] = faces["RIGHT"];
		newFaces["RIGHT"] = faces["FRONT"];
		newFaces["TOP"] = this.rotateFace(faces["TOP"], "ccw");
		newFaces["BOTTOM"] = this.rotateFace(faces["BOTTOM"], "cw");
		this.setState({ faces: newFaces });
		// console.log(this.state.cube);
	}

	lookToTopFace() {
		const faces = this.state.cube;
		let newFaces = {};
		newFaces["FRONT"] = faces["TOP"];
		newFaces["TOP"] = this.rotateFace(
			this.rotateFace(faces["BACK"], "cw"),
			"cw"
		); //fix issue?
		newFaces["BACK"] = this.rotateFace(
			this.rotateFace(faces["BOTTOM"], "cw"),
			"cw"
		); //fix issue?;
		newFaces["BOTTOM"] = faces["FRONT"];

		newFaces["LEFT"] = this.rotateFace(faces["LEFT"], "cw");
		newFaces["RIGHT"] = this.rotateFace(faces["RIGHT"], "ccw");
		this.setState({ faces: newFaces });
		// console.log(this.state.cube);
	}

	lookToBottomFace() {
		const faces = this.state.cube;
		let newFaces = {};
		newFaces["FRONT"] = faces["BOTTOM"];
		newFaces["BOTTOM"] = this.rotateFace(
			this.rotateFace(faces["BACK"], "cw"),
			"cw"
		); //fix issue?
		newFaces["BACK"] = this.rotateFace(
			this.rotateFace(faces["TOP"], "cw"),
			"cw"
		); //fix issue?
		newFaces["TOP"] = faces["FRONT"];
		newFaces["LEFT"] = this.rotateFace(faces["LEFT"], "ccw");
		newFaces["RIGHT"] = this.rotateFace(faces["RIGHT"], "cw");
		this.setState({ faces: newFaces });
		// console.log(this.state.cube);
	}

	rotateFrontCW(cube, directlyUpdateCube) {
		if (cube === undefined || cube["FRONT"] === undefined) {
			if (this.state.cube !== undefined) {
				cube = this.state.cube;
			} else {
				return;
			}
		}

		let newCube = {};

		let leftFace = JSON.parse(JSON.stringify(cube["LEFT"]));
		let topFace = JSON.parse(JSON.stringify(cube["TOP"]));
		let rightFace = JSON.parse(JSON.stringify(cube["RIGHT"]));
		let bottomFace = JSON.parse(JSON.stringify(cube["BOTTOM"]));

		//lazy algorithm
		leftFace[0][2] = cube["BOTTOM"][0][0];
		leftFace[1][2] = cube["BOTTOM"][0][1];
		leftFace[2][2] = cube["BOTTOM"][0][2];

		topFace[2][0] = cube["LEFT"][2][2];
		topFace[2][1] = cube["LEFT"][1][2];
		topFace[2][2] = cube["LEFT"][0][2];

		rightFace[0][0] = cube["TOP"][2][0];
		rightFace[1][0] = cube["TOP"][2][1];
		rightFace[2][0] = cube["TOP"][2][2];

		bottomFace[0][0] = cube["RIGHT"][2][0];
		bottomFace[0][1] = cube["RIGHT"][1][0];
		bottomFace[0][2] = cube["RIGHT"][0][0];

		newCube["FRONT"] = this.rotateFace(cube["FRONT"], "cw");
		newCube["BACK"] = cube["BACK"];
		newCube["LEFT"] = leftFace;
		newCube["TOP"] = topFace;
		newCube["RIGHT"] = rightFace;
		newCube["BOTTOM"] = bottomFace;

		if (directlyUpdateCube) {
			this.setState({ faces: newCube });
		} else {
			return newCube;
		}
	}

	rotateFront180Deg(cube) {
		let newCube = this.rotateFrontCW(cube);
		return this.rotateFrontCW(newCube);
	}

	rotateFrontCCW(cube, directlyUpdateCube) {
		console.log("in cube.js. Rotate front CCW");
		let newCube = this.rotateFront180Deg(cube);
		newCube = this.rotateFrontCW(newCube);
		if (directlyUpdateCube) {
			console.log(newCube);
			this.setState({ faces: newCube });
		} else {
			return newCube;
		}
	}

	makeTopBlack() {
		let newFaces = JSON.parse(JSON.stringify(this.state.cube));
		let face = this.state.cube["FRONT"];
		if (
			face === undefined ||
			face[0] === undefined ||
			face[0][0] === undefined
		) {
			console.log("could not set top black");
			return;
		}
		for (let i = 0; i < 3; i++) {
			for (let j = 0; j < 3; j++) {
				face[i][j] = "BLACK";
			}
		}
		newFaces["TOP"] = face;
		this.setState({ faces: newFaces });
	}

	getTopControls() {
		return (
			<>
				<div className="controls controls-top">
					<label>
						{" "}
						look to left
						<input
							type="checkbox"
							className="checkbox"
							onChange={this.lookToLeftFace}
						/>
					</label>
					<label>
						{" "}
						look to top
						<input
							type="checkbox"
							className="checkbox"
							onChange={this.lookToTopFace}
						/>
					</label>
					<label>
						{" "}
						look to bottom
						<input
							type="checkbox"
							className="checkbox"
							onChange={this.lookToBottomFace}
						/>
					</label>
					<label>
						{" "}
						look to right
						<input
							type="checkbox"
							className="checkbox"
							onChange={this.lookToRightFace}
						/>
					</label>
				</div>
			</>
		);
	}

	getBottomControls() {
		return (
			<>
				<div className="controls controls-bottom">
					<label>
						{" "}
						rotate front 180 degrees
						<input
							type="checkbox"
							className="checkbox"
							onChange={() => {
								this.setState({
									faces: this.rotateFront180Deg(
										this.state.cube
									),
								});
							}}
						/>
					</label>
				</div>

				<div className="controls controls-bottom">
					<label>
						{" "}
						make top black
						<input
							type="checkbox"
							className="checkbox"
							onChange={this.makeTopBlack}
						/>
					</label>
				</div>
				<form>
					<label for="fname">Save as:</label>
					<input type="text" id="saveAs" name="saveField"></input>
				</form>
				<button>save</button>
				<form>
					<label for="fname">load save:</label>
					<input type="text" id="loadSave" name="load"></input>
				</form>
				<button>save</button>
			</>
		);
	}

	render() {
		let renderableFaces = {};
		for (const faceName of faceNames) {
			const renderableFace = (
				<CubeFace
					face={this.state.cube[faceName]}
					// lookToFace={this.lookToTopFace} // TODO: lookToFace={this.lookToFace(top)};
					// rotateFace={...} // TODO
				/>
			);
			renderableFaces[faceName] = renderableFace;
		}
		// console.log("renderableFaces:");
		// console.log(renderableFaces);

		return (
			<>
				<Grid
					spacing={0}
					container
					direction="row"
					justify={"center"}
					className = "cube"
				>
					<Grid
						spacing={0}
						container
						direction="row"
						justify={"center"}
					>
						<Grid item xs={4}>
							{renderableFaces["TOP"]}
						</Grid>
					</Grid>
					<Grid
						spacing={0}
						container
						direction="row"
						justify={"center"}
					>
						<Grid item>{renderableFaces["LEFT"]}</Grid>
						<Grid item>{renderableFaces["FRONT"]}</Grid>
						<Grid item>{renderableFaces["RIGHT"]}</Grid>
					</Grid>
					<Grid
						spacing={0}
						container
						direction="row"
						justify={"center"}
					>
						<Grid item xs={4}>
							{renderableFaces["BOTTOM"]}
						</Grid>
					</Grid>
					<Grid
						spacing={0}
						container
						direction="row"
						justify={"center"}
					>
						{this.getBottomControls()}
					</Grid>
				</Grid>
			</>
		);
	}
}

export default Cube;
