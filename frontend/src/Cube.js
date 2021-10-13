import React from "react";
import "./App.css";
import { Grid } from "@material-ui/core";
import CubeFace from "./CubeFace";
import NextMoveBox from "./NextMoveBox";
import DataEntryField from "./DataEntryField";
import { rotate } from "mathjs";
import Button from "react-bootstrap/Button";
import SequenceDataService from "./services/SequenceDataService";

const faceNames = ["BOTTOM", "FRONT", "RIGHT", "BACK", "LEFT", "TOP"];

// rowCol may not strictly be row/column, but the cube comes together...
const faceCharacteristics = {
	FRONT: {
		initialColor: "BLUE",
		rowColTopLeft: [1, 1],
		faceCoords: { frozen: "+X" },
	},
	BACK: {
		initialColor: "GREEN",
		rowColTopLeft: [-1, -1],
		faceCoords: { frozen: "-X" },
	},
	RIGHT: {
		initialColor: "RED",
		rowColTopLeft: [1, 1],
		faceCoords: { frozen: "-Z" },
	},
	LEFT: {
		initialColor: "ORANGE",
		rowColTopLeft: [1, -1],
		faceCoords: { frozen: "+Z" },
	},
	TOP: {
		initialColor: "YELLOW",
		rowColTopLeft: [-1, 1],
		faceCoords: { frozen: "+Y" },
	},
	BOTTOM: {
		initialColor: "WHITE",
		rowColTopLeft: [1, 1],
		faceCoords: { frozen: "-Y" },
	},
};

const axes = { x: "X", y: "Y", z: "Z" };

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
			moveSequence: "",
			dbSequences: [],
		};

		this.getBottomControls = this.getBottomControls.bind(this);

		this.makeMove = this.makeMove.bind(this);
		this.loadState = this.loadState.bind(this);
		this.saveSequence = this.saveSequence.bind(this);
		this.getRenderableFaces = this.getRenderableFaces.bind(this);
		this.getAllSavedSequences = this.getAllSavedSequences.bind(this);
		this.getSequencesByName = this.getSequencesByName.bind(this);
	}

	componentDidMount() {
		this.loadInitialState();
	}

	loadInitialState() {
		console.log("loading initial state");
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
		console.log("updating this.state");
		this.setState({ cube: newCube, moveSequence: "" });
		console.log(this.state);
	}

	// loads a save state, as defined by sequence of moves
	async loadState(moveSequence) {
		console.log("loadState: ");
		console.log(moveSequence);
		const sequencePriorToLoad = this.state.moveSequence;
		const cubePriorToLoad = JSON.parse(JSON.stringify(this.state.cube));

		if (typeof moveSequence != "string") {
			throw new Error("moveSequence is not a string!");
		}

		const sequence = moveSequence.split(" ");

		await this.loadInitialState(); // annoying that await is necessary for this.setState

		for (const move of sequence) {
			try {
				this.makeMove(move);
			} catch (e) {
				console.log("illegal move: " + move);
				console.log("loading previous state");
				this.setState({
					cube: cubePriorToLoad,
					moveSequence: sequencePriorToLoad,
				});
				return;
			}
		}
	}

	// get all sequences from database
	async getAllSavedSequences() {
		let allSequences = await SequenceDataService.getAll();

		if (
			allSequences === undefined ||
			allSequences["data"]["sequenceList"] === undefined
		)
			throw new Error("sequences is undefined");
		console.log(allSequences["data"]["sequenceList"]);
		this.setState({ dbSequences: allSequences["data"]["sequenceList"] });
	}

	// get a sequences by name
	async getSequencesByName(name) {
		let allSequences = await SequenceDataService.find(name);

		if (
			allSequences === undefined ||
			allSequences["data"]["sequenceList"] === undefined
		)
			throw new Error("sequences is undefined");

		console.log(allSequences["data"]["sequenceList"]);
		this.setState({ dbSequences: allSequences["data"]["sequenceList"] });
		if (allSequences["data"]["sequenceList"].length > 0)
			this.loadState(allSequences["data"]["sequenceList"][0]["sequence"]);
	}

	// saves the current sequence.
	// TODO: Must later match delete pin in order to delete.
	async saveSequence(saveName) {
		const data = { name: saveName, sequence: this.state.moveSequence };
		console.log(`Cube.saveSequence(${saveName})`);
		console.log(data);
		let saveResponse = await SequenceDataService.saveNewSequence(data);
		console.log(saveResponse);
	}

	// helper to loadInitialState. frozenCoord is set to +/- 1.5, other coordinates depend on row/col
	createPiece(newFace, row, col, color) {
		const frozenCoord = newFace.faceCoords.frozen;
		let coordinates = [];
		switch (frozenCoord) {
			case "+X": // front
				coordinates = [2, row, col];
				break;
			case "-X": // back
				coordinates = [-2, row, col]; // coord system may not be correct TODO: fix
				break;
			case "-Z": // right
				coordinates = [col, row, -2];
				break;
			case "+Z": // left
				coordinates = [col, row, 2];
				break;
			case "+Y": //top
				coordinates = [row, 2, col];
				break;
			case "-Y": // bottom
				coordinates = [row, -2, col];
				break;

			default:
				throw new Error("frozenCoord does not have a valid case!");
		}
		const piece = { color: color, coordinates: coordinates };
		cubeMap.set(JSON.stringify(coordinates), piece);
		return piece;
	}

	// returns an array of pieces that satisfy the filter
	filterPieces(filter) {
		const matchingPieces = new Map();
		[...cubeMap].forEach(([k, v]) => {
			for (let i = 0; i < 3; i++) {
				const keyObj = JSON.parse(k);
				if (!(keyObj[i] >= filter.min[i] && keyObj[i] <= filter.max[i]))
					return;
			}
			matchingPieces.set(k, v);
		});
		return matchingPieces;
	}

	// accepts a string as input. ie "F", "F'", "F²"
	makeMove(moveString) {
		switch (moveString) {
			case "":
			case " ":
				return;
			case "~":
				this.loadInitialState();
				return;

			case "F":
				this.rotateHelper(pieceFilter.posX, axes.x, -0.5);
				break;
			case "F'":
				this.rotateHelper(pieceFilter.posX, axes.x, +0.5);
				break;
			case "F²":
			case "F2":
				this.rotateHelper(pieceFilter.posX, axes.x, 1);
				break;

			case "B":
				this.rotateHelper(pieceFilter.negX, axes.x, +0.5);
				break;
			case "B'":
				this.rotateHelper(pieceFilter.negX, axes.x, -0.5);
				break;
			case "B²":
			case "B2":
				this.rotateHelper(pieceFilter.negX, axes.x, 1);
				break;

			case "U":
				this.rotateHelper(pieceFilter.posY, axes.y, -0.5);
				break;
			case "U'":
				this.rotateHelper(pieceFilter.posY, axes.y, 0.5);
				break;
			case "U²":
			case "U2":
				this.rotateHelper(pieceFilter.posY, axes.y, 1);
				break;

			case "D":
				this.rotateHelper(pieceFilter.negY, axes.y, +0.5);
				break;
			case "D'":
				this.rotateHelper(pieceFilter.negY, axes.y, -0.5);
				break;
			case "D²":
			case "D2":
				this.rotateHelper(pieceFilter.negY, axes.y, 1);
				break;

			case "L":
				this.rotateHelper(pieceFilter.posZ, axes.z, -0.5);
				break;
			case "L'":
				this.rotateHelper(pieceFilter.posZ, axes.z, +0.5);
				break;
			case "L²":
			case "L2":
				this.rotateHelper(pieceFilter.posZ, axes.z, 1);
				break;

			case "R":
				this.rotateHelper(pieceFilter.negZ, axes.z, +0.5);
				break;
			case "R'":
				this.rotateHelper(pieceFilter.negZ, axes.z, -0.5);
				break;
			case "R²":
			case "R2":
				this.rotateHelper(pieceFilter.negZ, axes.z, 1);
				break;

			// whole cube rotations. Unfortunately, these do not correspond to the grid's coordinates.
			case "x": // rotate the entire cube on R
				this.rotateHelper(pieceFilter.all, axes.z, +0.5);
				break;
			case "x'":
				this.rotateHelper(pieceFilter.all, axes.z, -0.5);
				break;
			case "x²":
			case "x2":
				this.rotateHelper(pieceFilter.all, axes.z, 1);
				break;

			case "y": // rotate the entire cube on U
				this.rotateHelper(pieceFilter.all, axes.y, -0.5);
				break;
			case "y'":
				this.rotateHelper(pieceFilter.all, axes.y, +0.5);
				break;
			case "y²":
			case "y2":
				this.rotateHelper(pieceFilter.all, axes.y, 1);
				break;

			case "z": // rotate the entire cube on F
				this.rotateHelper(pieceFilter.all, axes.x, -0.5);
				break;
			case "z'":
				this.rotateHelper(pieceFilter.all, axes.x, +0.5);
				break;
			case "z²":
			case "z2":
				this.rotateHelper(pieceFilter.all, axes.x, 1);
				break;

			default:
				throw new Error("move string is illegal: " + moveString);
		}

		// record move, updating graphic
		this.setState({
			moveSequence: this.state.moveSequence + moveString + " ",
		});
		console.log(this.state.moveSequence);
	}

	// may only be called by makeMove, less the graphic may not be updated.
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
		// matchingPieces is directly mapped to cube. matchingPiecesBeforeRotation has their colors before the rotation.
		let matchingPieces = this.filterPieces(filter);

		// shallow copy matchingPieces
		let matchingPiecesBeforeRotation = new Map();

		for (const pieceMap of matchingPieces) {
			matchingPiecesBeforeRotation.set(
				pieceMap[0],
				JSON.parse(JSON.stringify(pieceMap[1]))
			);
		}

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

			// sanity check
			if (!matchingPieces.has(JSON.stringify(newPieceMatrix))) {
				console.log(newPieceMatrix);
				throw new Error(
					"calculated coordinates are not in matchingPieces!"
				);
			}

			// update color
			let pieceToBeUpdated = matchingPieces.get(
				JSON.stringify(newPieceMatrix)
			);
			pieceToBeUpdated.color = pieceMap[1].color;

			matchingPieces.set(JSON.stringify(newPieceMatrix), {
				color: pieceMap[1].color,
			});
		}
	}

	getBottomControls() {
		return (
			<div className="controls controls-bottom">
				<NextMoveBox makeMove={this.makeMove}></NextMoveBox>

				<DataEntryField
					label="sequence"
					onEnter={this.loadState}
				></DataEntryField>
				<DataEntryField
					label=" save as:"
					onEnter={this.saveSequence}
				></DataEntryField>
				<DataEntryField
					label=" search for sequence"
					onEnter={this.getSequencesByName}
				></DataEntryField>

				<Button onClick={this.getAllSavedSequences}>
					get all saved sequences
				</Button>
			</div>
		);
	}

	// creates the cube faces
	getRenderableFaces() {
		let renderableFaces = {};
		for (const faceName of faceNames) {
			const renderableFace = (
				<CubeFace face={this.state.cube[faceName]} />
			);
			renderableFaces[faceName] = renderableFace;
		}
		return renderableFaces;
	}

	// gets cube. In grid, etc.
	getRenderableCubeNet() {
		const renderableFaces = this.getRenderableFaces();
		return (
			<Grid container>
				<Grid container item xs={4} className="left_column">
					<Grid item xs={3}></Grid>
					{renderableFaces["LEFT"]}
					<Grid item xs={3}></Grid>
				</Grid>
				<Grid
					container
					direction="column"
					item
					xs={4}
					className="center_column"
				>
					{renderableFaces["TOP"]}
					{renderableFaces["FRONT"]}
					{renderableFaces["BOTTOM"]}
				</Grid>
				<Grid item xs={4} container className="right_column">
					<Grid item xs={3}></Grid>
					{renderableFaces["RIGHT"]}
					<Grid item xs={3}></Grid>
					{/* {renderableFaces["BACK"]} */}
				</Grid>
			</Grid>
		);
	}

	getRenderableCube3d() {
		const renderableFaces = this.getRenderableFaces();

		return (
			<Grid container className="scene_3d">
				{renderableFaces.FRONT}
				{/* {renderableFaces.BACK} */}
				{/* {renderableFaces.RIGHT} */}
				{renderableFaces.LEFT}
				{renderableFaces.TOP}
				{/* {renderableFaces.BOTTOM} */}
			</Grid>
		);
	}

	render() {
		const bottomControls = this.getBottomControls();
		const cubeNet = this.getRenderableCubeNet();
		const cube3d = this.getRenderableCube3d();

		return (
			<>
				{/* {cubeNet} */}
				{cube3d}
				{bottomControls}
				{this.state.moveSequence}
			</>
		);
	}
}

export default Cube;
