import React from "react";
import "./App.css";
import { Grid } from "@material-ui/core";
import CubeFace from "./CubeFace";

const faceNames = ["BOTTOM", "FRONT", "RIGHT", "BACK", "LEFT", "TOP"];

const faceCharacteristics = {
	FRONT: {
		initialColor: "BLUE",
		rowColTopLeft: [1,-1],
		faceCoords: { frozen: "+X", row: "Y", col: "Z" },
	},
	BACK: {
		initialColor: "GREEN",
		rowColTopLeft: [1,-1], // guess
		faceCoords: { frozen: "-X", row: "Y", col: "Z" },
	},
	RIGHT: {
		initialColor: "RED",
		rowColTopLeft: [1,1],
		faceCoords: { frozen: "+Y", row: "X", col: "Z" },
	},
	LEFT: {
		initialColor: "ORANGE",
		rowColTopLeft: [1,-1],
		faceCoords: { frozen: "-Y", row: "X", col: "Z" },
	},
	TOP: {
		initialColor: "YELLOW",
		rowColTopLeft: [-1,-1],
		faceCoords: { frozen: "+Z", row: "Y", col: "X" },
	},
	BOTTOM: {
		initialColor: "WHITE",
		rowColTopLeft: [1,-1],
		faceCoords: { frozen: "-Z", row: "Y", col: "X" },
	},
};

const axes = { x: "X", y: "Y", z: "Z" };

const rotationDirs = { cw: -90, ccw: +90 };

// used to distinguish top, meat, bottom layers on each face. Assuming rendered for viewing at front face.
const rowTopLeft = {
	// may not be correct yet
	FRONT: 1,
	BACK: 1,
	RIGHT: 1,
	LEFT: 1,
	TOP: -1,
	BOTTOM: 1,
};

const pieceFilter = {
	posX: "POSX",
	negX: "NEGX",
	posY: "POSY",
	negY: "NEGY",
	posZ: "POSZ",
	negZ: "NEGZ",
};

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
		console.log("this.state.cube");
		console.log(this.state.cube);
	}

	// helper to loadInitialState. frozenCoord is set to +/- 1.5, other coordinates depend on row/col
	createPiece(newFace, row, col, color) {
		const frozenCoord = newFace.faceCoords.frozen;
		const rowCoord = newFace.faceCoords.row;
		const colCoord = newFace.faceCoords.col;
		let coordinates = {};
		switch (frozenCoord) {
			case "+X": // front
				coordinates = { x: 1.5, y: col, z: row }; // coord system may not be correct TODO: fix
				break;
			case "-X": // back
				coordinates = { x: -1.5, y: col, z: row };
				break;
			case "+Y": // right
				coordinates = { x: col, y: 1.5, z: row };
				break;
			case "-Y": // left
				coordinates = { x: col, y: -1.5, z: row };
				break;
			case "+Z": //top
				coordinates = { x: row, y: col, z: 1.5 };
				break;
			case "-Z": // bottom
				coordinates = { x: row, y: col, z: -1.5 };
				break;

			default:
				throw new Error("frozenCoord does not have a valid case!");
		}
		return { color: color, coordinates: coordinates };
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
		console.log("renderableFaces:");
		console.log(renderableFaces);

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
						{renderableFaces["BACK"]}
					</Grid>
				</Grid>
			</>
		);
	}
}

export default Cube;
