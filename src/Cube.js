import React from "react";
import "./App.css";
import { Grid } from "@material-ui/core";
import CubeFace from "./CubeFace";
import { pi, rotate } from "mathjs";

const faceNames = ["BOTTOM", "FRONT", "RIGHT", "BACK", "LEFT", "TOP"];

const faceCharacteristics = {
	FRONT: {
		initialColor: "BLUE",
		rowColTopLeft: [1, -1],
		faceCoords: { frozen: "+X", row: "Y", col: "Z" },
	},
	BACK: {
		initialColor: "GREEN",
		rowColTopLeft: [1, -1], // guess
		faceCoords: { frozen: "-X", row: "Y", col: "Z" },
	},
	RIGHT: {
		initialColor: "RED",
		rowColTopLeft: [1, 1],
		faceCoords: { frozen: "+Y", row: "X", col: "Z" },
	},
	LEFT: {
		initialColor: "ORANGE",
		rowColTopLeft: [1, -1],
		faceCoords: { frozen: "-Y", row: "X", col: "Z" },
	},
	TOP: {
		initialColor: "YELLOW",
		rowColTopLeft: [-1, -1],
		faceCoords: { frozen: "+Z", row: "Y", col: "X" },
	},
	BOTTOM: {
		initialColor: "WHITE",
		rowColTopLeft: [1, -1],
		faceCoords: { frozen: "-Z", row: "Y", col: "X" },
	},
};

const axes = { x: "X", y: "Y", z: "Z" };

const rotationDirs = { cw: -90, ccw: +90 };

const pieceFilter = {
	all: { min: [-2, -2, -2], max: [2, 2, 2] },
	posX: { min: [1, -2, -2], max: [2, 2, 2] },
	negX: { min: [-2, -2, -2], max: [-1, 2, 2] },
	posY: { min: [-2, 1, -2], max: [2, 2, 2] },
	negY: { min: [-2, -2, -2], max: [2, -1, 2] },
	posZ: { min: [-2, -2, 1], max: [2, 2, 2] },
	negZ: { min: [-2, -2, -2], max: [2, 2, -1] },
};

// a better way to iterate through pieces
const cubeMap = new Map();

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
		this.getTopControls = this.getTopControls.bind(this);
		this.getBottomControls = this.getBottomControls.bind(this);
	}

	componentDidMount() {
		this.loadInitialState();
	}

	async loadInitialState() {
		let newCube = {};
		for (const faceName of faceNames) {
			let newFace = Object.assign(faceCharacteristics[faceName]);
			if (newFace === undefined)
				throw new Error("face is undefined!: " + faceName);
			newFace.faceName = faceName; // redundant?

			newFace["grid"] = {};

			// write data to each face
			for (let row = -1; row < 2; row++) {
				newFace["grid"][row] = {};
				for (let col = -1; col < 2; col++) {
					const newPiece = this.createPiece(
						newFace,
						row,
						col,
						newFace.initialColor
					);
					newFace["grid"][row][col] = newPiece;
				}
			}
			newCube[faceName] = newFace;
		}
		await this.setState({ cube: newCube });
	}

	// helper to loadInitialState. frozenCoord is set to +/- 1.5, other coordinates depend on row/col
	createPiece(newFace, row, col, color) {
		const frozenCoord = newFace.faceCoords.frozen;
		const rowCoord = newFace.faceCoords.row;
		const colCoord = newFace.faceCoords.col;
		let coordinates = [];
		switch (frozenCoord) {
			case "+X": // front
				coordinates = [2, col, row];
				break;
			case "-X": // back
				coordinates = [-2, col, row]; // coord system may not be correct TODO: fix
				break;
			case "+Y": // right
				coordinates = [col, 2, row];
				break;
			case "-Y": // left
				coordinates = [col, -2, row];
				break;
			case "+Z": //top
				coordinates = [row, col, 2];
				break;
			case "-Z": // bottom
				coordinates = [row, col, -2];
				break;

			default:
				throw new Error("frozenCoord does not have a valid case!");
		}
		const piece = { color: color, coordinates: coordinates };
		cubeMap.set(coordinates, piece);
		return piece;
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
				this.rotateHelper(pieceFilter.posX, axes.x, dir);
				break;
			case "BACK":
				this.rotateHelper(pieceFilter.negX, axes.x, dir); // mirror this?
				break;

			default:
				throw new Error("rotate called with an invalid face");
		}
	}

	// rotates all faces matching the filter along the specified axis by specified degrees. Updates this.state.cube
	rotateHelper(filter, axisOfRotation, piRadians) {
		console.log(
			"in rotate helper. args: " +
				filter +
				" " +
				axisOfRotation +
				" " +
				piRadians
		);

		// setup rotation
		// TODO: hardcode common values to avoid rounding?
		const cos = Math.cos(Math.PI * piRadians);
		const sin = Math.sin(Math.PI * piRadians);
		let rotationMatrix = [];

		switch (axisOfRotation) {
			case axes.x:
				rotationMatrix = [1, 0, 0];
				break;
			case axes.y:
				rotationMatrix = [0, 1, 0];
				break;
			case axes.z:
				rotationMatrix = [0, 0, 1];
				break;
			default:
				throw new Error(
					"axisOfRotation is not valid: " + axisOfRotation
				);
		}
		// matchignPieces is directly mapped to cube. matchingPiecesBeforeRotation has their colors before the rotation.
		let matchingPieces = this.filterPieces(filter);
		const matchingPiecesBeforeRotation = new Map(matchingPieces);

		// console.log("this.state.cube before");
		// console.log(this.state.cube);
		// console.log("matchingPieces before");
		// console.log(matchingPieces);

		// calculate new coordinates for each piece - ie which piece will be recolored
		for (const pieceMap of matchingPiecesBeforeRotation) {
			let newPieceMatrix = rotate(
				pieceMap[1].coordinates,
				Math.PI * piRadians,
				rotationMatrix
			);

			// round the coordinates
			for (let i = 0; i < 3; i++)
				newPieceMatrix[i] = Math.round(newPieceMatrix[i]);

			// update color
			console.log("matchingPieces");
			console.log(matchingPieces);
			console.log(newPieceMatrix, pieceMap[1].color);

			if (!matchingPieces.has(newPieceMatrix)) {
				console.log(newPieceMatrix);
				throw new Error(
					"calculated coordinates are not in matchingPieces!"
				);
			}

			let pieceToBeUpdated = matchingPieces.get(newPieceMatrix);
			console.log(pieceToBeUpdated);
			pieceToBeUpdated.color = pieceMap[1].color;

			matchingPieces.set(newPieceMatrix, {
				coordinates: newPieceMatrix,
				color: pieceMap[1].color,
			});
		}
		console.log("matchingPieces after");
		console.log(matchingPieces);

		// console.log("this.state.cube after");
		// console.log(this.state.cube);
	}

	// returns an array of pieces that satisfy the filter
	filterPieces(filter) {
		// let matchingPieces = [];
		// filter out pieces that match the filter. Look through each face.
		// TODO: may rework for efficient

		const matchingPieces = new Map();

		[...cubeMap].filter(([k, v]) => {
			for (let i = 0; i < 3; i++) {
				if (!(k[i] >= filter.min[i] && k[i] <= filter.max[i])) return;
			}
			matchingPieces.set(k, v);
		});

		console.log("matchingPieces");
		console.log(matchingPieces);
		return matchingPieces;
	}

	lookToRightFace() {
		console.log("looking to right face");
		this.rotateHelper(pieceFilter.all, axes.z, -0.5);
	}

	lookToLeftFace() {
		console.log("looking to left face");
		this.rotateHelper(pieceFilter.all, axes.z, +0.5);
	}

	lookToTopFace() {
		console.log("looking to top face");
		this.rotateHelper(pieceFilter.all, axes.y, -0.5);
	}

	lookToBottomFace() {
		console.log("looking to bottom face");
		this.rotateHelper(pieceFilter.all, axes.y, +0.5);
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
		console.log("rotate front 180 degrees");
		this.rotateHelper(pieceFilter.posX, axes.x, 1);
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

	// gets cube. In grid, etc.
	getRenderableCube() {
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

		return (
			<>
				<Grid container>
					<Grid container item xs="4" className="left_column">
						<Grid item xs="3"></Grid>
						{renderableFaces["LEFT"]}
						<Grid item xs="3"></Grid>
					</Grid>
					<Grid
						container
						direction="column"
						item
						xs="4"
						className="center_column"
					>
						{renderableFaces["TOP"]}
						{renderableFaces["FRONT"]}
						{renderableFaces["BOTTOM"]}
					</Grid>
					<Grid container item xs="4" className="right_column">
						<Grid item xs="3"></Grid>
						{renderableFaces["RIGHT"]}
						<Grid item xs="3"></Grid>
						{/* {renderableFaces["BACK"]} */}
					</Grid>
				</Grid>
			</>
		);
	}

	render() {
		const topControls = this.getTopControls();
		const bottomControls = this.getBottomControls();
		const renderableCube = this.getRenderableCube();
		return (
			<>
				{topControls}
				{renderableCube}
				{bottomControls}
			</>
		);
	}
}

export default Cube;
